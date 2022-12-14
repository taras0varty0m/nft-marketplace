import { Injectable, Logger } from '@nestjs/common';
import { AssetOwnerNotFoundException } from 'src/assets/exceptions/asset-owner-not-found.exception';
import { AssetsRepository } from 'src/assets/repositories/assets.repository';
import { NotEnoughBalanceException } from 'src/wallets/exceptions/not-enough-balance.exception';
import { UserWalletNotFoundException } from 'src/wallets/exceptions/user-wallet-not-found.exception';
import { WalletsRepository } from 'src/wallets/repositories/wallets.repository';
import { WalletsService } from 'src/wallets/services/wallets.service';
import { DataSource } from 'typeorm';

import { AssetEntity } from '../../assets/entities/asset.entity';
import { BuyOwnAssetForbiddenException } from '../../assets/exceptions/buy-asset-forbidden.exception';
import { AssetsService } from '../../assets/services/assets.service';
import { UserEntity } from '../../users/entities/user.entity';
import { AssetNotFoundException } from './../../assets/exceptions/asset-not-found.exception';
import { TransactionRepository } from './../repositories/transaction.repository';

@Injectable()
export class TransactionsService {
  private logger = new Logger(TransactionsService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletsService: WalletsService,
    private readonly walletsRepository: WalletsRepository,
    private readonly assetsService: AssetsService,
    private readonly assetsRepository: AssetsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async buyAsset(assetId: string, buyer: Pick<UserEntity, 'id' | 'wallet'>) {
    try {
      return this.dataSource.transaction(async (manager) => {
        if (!buyer.wallet) {
          const buyerWallet = await this.walletsRepository.findOne({
            where: { ownerId: buyer.id },
          });

          if (!buyerWallet) {
            throw new UserWalletNotFoundException(buyer.id);
          }

          buyer.wallet = buyerWallet;
        }

        const asset = await this.assetsRepository.getAssetAndOwner(assetId);

        if (!asset.owner) {
          throw new AssetOwnerNotFoundException(asset.id);
        }

        if (!asset.owner.wallet) {
          throw new UserWalletNotFoundException(asset.owner.id);
        }

        this.validateTransaction(asset, assetId, buyer);

        const { id } = await this.transactionRepository.save(
          this.createBuyTransactionEntity(asset, buyer.id, buyer.wallet.coin),
        );

        await manager.save(
          await Promise.all([
            this.walletsService.increaseBalance(
              asset.owner.wallet,
              asset.price,
            ),
            this.walletsService.decreaseBalance(buyer.wallet, asset.price),
            this.assetsService.transferOwnership(asset, buyer.id),
            this.assetsService.increaseAssetValue(asset),
          ]),
        );

        return this.transactionRepository.findOneOrFail({
          where: { id },
          relations: ['asset', 'buyer', 'seller', 'asset.owner'],
        });
      });
    } catch (err) {
      this.logger.error(
        err,
        'Error while buying asset, transaction rolled back',
      );

      throw new Error('Something went wrong while buying asset');
    }
  }

  async viewTransactions(userId: UserEntity['id']) {
    return this.transactionRepository.find({
      where: [
        {
          buyerId: userId,
        },
        { sellerId: userId },
      ],
      relations: ['asset', 'buyer', 'seller', 'asset.owner'],
    });
  }

  private validateTransaction(
    asset: AssetEntity,
    assetId: string,
    buyer: Pick<UserEntity, 'id' | 'wallet'>,
  ) {
    if (!buyer.wallet) {
      throw new UserWalletNotFoundException(buyer.id);
    }

    if (!asset) throw new AssetNotFoundException(assetId);

    if (asset.ownerId === buyer.id) {
      throw new BuyOwnAssetForbiddenException(assetId);
    }

    if (+buyer.wallet.balance < +asset.price) {
      throw new NotEnoughBalanceException();
    }
  }

  private createBuyTransactionEntity(
    asset: AssetEntity,
    buyerId: UserEntity['id'],
    coin: string,
  ) {
    return this.transactionRepository.create({
      coin,
      buyerId,
      assetId: asset.id,
      sellerId: asset.ownerId,
      amount: asset.price,
    });
  }
}
