import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { AssetEntity } from '../entities/asset.entity';
import { IAssetSearchArgs, ICreateAsset } from '../types';

@Injectable()
export class AssetsRepository extends Repository<AssetEntity> {
  constructor(dataSource: DataSource) {
    super(AssetEntity, dataSource.createEntityManager());
  }

  async getAssetAndOwner(id: string): Promise<AssetEntity> {
    return this.findOneOrFail({
      where: { id },
      relations: ['owner', 'owner.wallet'],
    });
  }

  async createAsset(createAssetData: ICreateAsset, userId: UserEntity['id']) {
    const newAsset = this.create({
      ...createAssetData,
      ownerId: userId,
      creatorId: userId,
    });

    return this.save(newAsset);
  }

  async getAssets(assetSearchArgs: IAssetSearchArgs) {
    const { searchTerm, limit, offset, orderBy } = assetSearchArgs;
    const { field, direction } = orderBy;

    const [assets, total] = await this.findAndCount({
      where: [
        { title: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
        { category: ILike(`%${searchTerm}%`) },
        { creator: { nickname: ILike(`%${searchTerm}%`) } },
        { creator: { firstName: ILike(`%${searchTerm}%`) } },
        { creator: { lastName: ILike(`%${searchTerm}%`) } },
        { owner: { nickname: ILike(`%${searchTerm}%`) } },
        { owner: { firstName: ILike(`%${searchTerm}%`) } },
        { owner: { lastName: ILike(`%${searchTerm}%`) } },
      ],
      order: {
        [field]: direction,
      },
      skip: offset,
      take: limit,
      relations: ['owner', 'creator'],
    });

    return {
      assets,
      paginationInfo: {
        total,
        limit,
        offset,
      },
    };
  }
}
