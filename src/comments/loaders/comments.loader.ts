import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { PaginationArgs } from 'src/common/pagination-filtering/pagination.args';

import { CommentsService } from './../services/comments.service';

@Injectable({ scope: Scope.REQUEST })
export class CommentsLoader {
  constructor(private readonly commentsService: CommentsService) {}

  public getPaginatedCommentsForAsset(paginationArgs: PaginationArgs) {
    return new DataLoader(async (assetIds: readonly string[]) => {
      const paginatedComments =
        await this.commentsService.getCommentsByAssetIds(
          assetIds as string[],
          paginationArgs,
        );

      return assetIds.map((assetId) => paginatedComments[assetId] ?? []);
    });
  }
}
