import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PaginationArgs } from 'src/common/pagination-filtering/pagination.args';

import { CommentsService } from './../services/comments.service';

@Injectable({ scope: Scope.REQUEST })
export class CommentsLoader {
  constructor(private readonly commentsService: CommentsService) {}
  paginationArgs: PaginationArgs;

  public getPaginatedCommentsByAssetIdsLoader = new DataLoader(
    async (assetIds: readonly string[]) => {
      const paginatedComments =
        await this.commentsService.getCommentsByAssetIds(
          assetIds as string[],
          this.paginationArgs,
        );

      return assetIds.map((assetId) => paginatedComments[assetId] ?? []);
    },
  );

  public getPaginatedCommentsForAsset(paginationArgs: PaginationArgs) {
    this.paginationArgs = paginationArgs;
    return this.getPaginatedCommentsByAssetIdsLoader;
  }
}
