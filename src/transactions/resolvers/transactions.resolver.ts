import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import { UserEntity } from '../../users/entities/user.entity';
import { TransactionOutput } from '../dto/transaction.output';
import { TransactionsService } from '../services/transactions.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => TransactionOutput)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => TransactionOutput)
  buyAsset(
    @Args('assetId', { type: () => String }) assetId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.transactionsService.buyAsset(assetId, user);
  }

  @Query(() => [TransactionOutput])
  viewTransactions(@CurrentUser() { id }: UserEntity) {
    return this.transactionsService.viewTransactions(id);
  }
}
