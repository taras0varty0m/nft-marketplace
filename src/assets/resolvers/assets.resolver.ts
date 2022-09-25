import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/pagination-filtering/pagination.args';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import { CommentsLoader } from '../../comments/loaders/comments.loader';
import { AssetSearchArgs } from '../dto/asset-search.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateAssetInput } from '../dto/create-asset.input';
import { Asset } from '../models/asset.model';
import { PaginatedAssets } from '../models/paginated-assets.model';
import { AssetsService } from '../services/assets.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Asset)
export class AssetResolver {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly commentsLoader: CommentsLoader,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Asset)
  createAsset(
    @Args('createAssetInput') createAssetInput: CreateAssetInput,
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.assetsService.createAsset(createAssetInput, userId);
  }

  @Query(() => PaginatedAssets)
  async getAllAssets(@Args() args: AssetSearchArgs) {
    return this.assetsService.getAssets(args);
  }

  @Query(() => Asset)
  async getAssetById(@Args('assetId', { type: () => ID }) assetId: string) {
    return this.assetsService.getAssetAndOwner(assetId);
  }

  @ResolveField('comments')
  async comments(@Parent() asset: Asset, @Args() args: PaginationArgs) {
    return this.commentsLoader
      .getPaginatedCommentsForAsset(args)
      .load(asset.id);
  }

  @Mutation(() => Asset)
  async deleteAsset(
    @Args('id', { type: () => ID }) assetId: string,
    @CurrentUser() userId: UserEntity['id'],
  ) {
    return this.assetsService.removeAsset(assetId, userId);
  }
}
