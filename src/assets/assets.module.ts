import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsLoader } from '../comments/loaders/comments.loader';
import { CommentsModule } from './../comments/comments.module';
import { AssetEntity } from './entities/asset.entity';
import { AssetsRepository } from './repositories/assets.repository';
import { AssetResolver } from './resolvers/assets.resolver';
import { AssetsService } from './services/assets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity]),
    forwardRef(() => CommentsModule),
  ],
  providers: [AssetResolver, AssetsService, CommentsLoader, AssetsRepository],
  exports: [AssetsService, AssetsRepository],
})
export class AssetsModule {}
