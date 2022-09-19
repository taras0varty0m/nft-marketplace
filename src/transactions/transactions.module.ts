import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from 'src/wallets/wallets.module';

import { AssetsModule } from '../assets/assets.module';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [
    WalletsModule,
    AssetsModule,
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  providers: [TransactionsResolver, TransactionsService, TransactionRepository],
  exports: [TransactionsService],
})
export class TransactionsModule {}
