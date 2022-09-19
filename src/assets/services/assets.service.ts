import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as currency from 'currency.js';
import { FindManyOptions } from 'typeorm';

import { AssetSearchArgs } from '../../common/pagination-filtering/asset-search.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateAssetInput } from '../dto/create-asset.input';
import { AssetEntity } from '../entities/asset.entity';
import { AssetNotFoundException } from '../exceptions/asset-not-found.exception';
import { AssetsRepository } from '../repositories/assets.repository';

@Injectable()
export class AssetsService {
  constructor(private readonly assetRepository: AssetsRepository) {}

  async count(options: FindManyOptions<AssetEntity>) {
    return this.assetRepository.count(options);
  }

  async createAsset(
    createAssetInput: CreateAssetInput,
    userId: UserEntity['id'],
  ) {
    return this.assetRepository.createAsset(createAssetInput, userId);
  }

  async getAssets(assetSearchArgs: AssetSearchArgs) {
    return this.assetRepository.getAssets(assetSearchArgs);
  }

  async getAssetAndOwner(assetId: string): Promise<AssetEntity> {
    const asset = await this.assetRepository.getAssetAndOwner(assetId);

    if (!asset) {
      throw new AssetNotFoundException(assetId);
    }

    return asset;
  }

  async removeAsset(id: string, userId: UserEntity['id']) {
    const asset = await this.assetRepository.findOne({ where: { id } });

    if (!asset) {
      throw new AssetNotFoundException(id);
    }

    if (asset.ownerId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this asset',
      );
    }

    const deleteResult = await this.assetRepository.delete(id);

    return Boolean(deleteResult.affected);
  }

  async transferOwnership(
    asset: AssetEntity,
    newOwnerId: UserEntity['id'],
  ): Promise<AssetEntity> {
    asset.ownerId = newOwnerId;
    asset.lastSaleAt = new Date();

    return asset;
  }

  async increaseAssetValue(asset: AssetEntity) {
    const newPrice = currency(asset.price, { precision: 8 }).multiply(
      1.1,
    ).value;

    asset.price = newPrice;

    return asset;
  }
}
