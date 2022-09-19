import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from 'src/assets/entities/asset.entity';

import { AssetsRepository } from './../assets/repositories/assets.repository';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, AssetEntity])],
  providers: [UsersResolver, UsersService, UsersRepository, AssetsRepository],
  exports: [UsersService],
})
export class UsersModule {}
