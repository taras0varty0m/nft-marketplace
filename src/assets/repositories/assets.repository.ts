import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';

import { AssetSearchArgs } from '../../common/pagination-filtering/asset-search.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateAssetInput } from '../dto/create-asset.input';
import { AssetEntity } from '../entities/asset.entity';

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

  async createAsset(
    createAssetInput: CreateAssetInput,
    userId: UserEntity['id'],
  ) {
    const newAsset = this.create({
      ...createAssetInput,
      ownerId: userId,
      creatorId: userId,
    });

    return this.save(newAsset);
  }

  async getAssets(assetSearchArgs: AssetSearchArgs) {
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
