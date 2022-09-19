import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entities/user.entity';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import { CreateWalletInput } from '../dto/create-wallet.input';
import { WalletOutput } from '../dto/wallet.output';
import { WalletEntity } from '../entities/wallet.entity';
import { UserWalletNotFoundException } from '../exceptions/user-wallet-not-found.exception';
import { WalletsService } from '../services/wallets.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => WalletOutput)
export class WalletsResolver {
  constructor(private readonly walletsService: WalletsService) {}

  @Query(() => WalletOutput)
  async viewWallet(@CurrentUser() { id: userId }: UserEntity) {
    const wallet = await this.walletsService.findOne({
      where: { ownerId: userId },
      relations: ['owner'],
    });

    if (!wallet) {
      throw new UserWalletNotFoundException(userId);
    }

    return wallet;
  }

  @Mutation(() => WalletOutput)
  createWallet(
    @Args('createWalletInput') createWalletInput: CreateWalletInput,
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.walletsService.createWallet(createWalletInput, userId);
  }

  @Mutation(() => Boolean)
  deleteWallet(
    @Args('walletId') walletId: WalletEntity['id'],
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.walletsService.deleteWallet(walletId, userId);
  }
}
