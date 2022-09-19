import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from 'src/assets/entities/asset.entity';

import { AssetsRepository } from '../assets/repositories/assets.repository';
import { WalletEntity } from './entities/wallet.entity';
import { WalletsRepository } from './repositories/wallets.repository';
import { WalletsService } from './services/wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, AssetEntity])],
  providers: [WalletsService, WalletsRepository, AssetsRepository],
  exports: [WalletsService],
})
export class WalletsModule {}
