import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as currency from 'currency.js';

import { UserEntity } from '../../users/entities/user.entity';
import { AssetEntity } from '../entities/asset.entity';
import { AssetNotFoundException } from '../exceptions/asset-not-found.exception';
import { AssetsRepository } from '../repositories/assets.repository';
import { IAssetSearchArgs, ICreateAsset } from '../types';

@Injectable()
export class AssetsService {
  constructor(private readonly assetRepository: AssetsRepository) {}

  async createAsset(createAssetData: ICreateAsset, userId: UserEntity['id']) {
    return this.assetRepository.createAsset(createAssetData, userId);
  }

  async getAssets(assetSearchArgs: IAssetSearchArgs) {
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
