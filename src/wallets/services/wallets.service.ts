import { Injectable } from '@nestjs/common';
import * as currency from 'currency.js';
import { UserEntity } from 'src/users/entities/user.entity';
import { FindOneOptions } from 'typeorm';
import { CreateWalletInput } from '../dto/create-wallet.input';

import { WalletEntity } from '../entities/wallet.entity';
import { WalletNotFoundException } from '../exceptions/wallet-not-found.exception';
import { WalletsRepository } from '../repositories/wallets.repository';

@Injectable()
export class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  async findOne(options: FindOneOptions<WalletEntity>) {
    return this.walletsRepository.findOne(options);
  }

  async createWallet(
    createWalletInput: CreateWalletInput,
    ownerId: UserEntity['id'],
  ) {
    return this.walletsRepository.save(
      this.walletsRepository.create({ ...createWalletInput, ownerId }),
    );
  }

  async increaseBalance(
    wallet: WalletEntity,
    amount: number,
  ): Promise<WalletEntity> {
    const increasedBalance = currency(wallet.balance, { precision: 8 }).add(
      amount,
    ).value;

    wallet.balance = increasedBalance;

    return wallet;
  }

  async decreaseBalance(
    wallet: WalletEntity,
    amount: number,
  ): Promise<WalletEntity> {
    const decreasedBalance = currency(wallet.balance, {
      precision: 8,
    }).subtract(amount).value;

    wallet.balance = decreasedBalance;

    return wallet;
  }

  async deleteWallet(walletId: string, ownerId: string) {
    const wallet = await this.walletsRepository.findOne({
      where: { id: walletId },
      select: ['ownerId'],
    });

    if (!wallet || wallet.ownerId !== ownerId) {
      throw new WalletNotFoundException(walletId);
    }

    const deleteResult = await this.walletsRepository.delete(walletId);

    return Boolean(deleteResult.affected);
  }
}
