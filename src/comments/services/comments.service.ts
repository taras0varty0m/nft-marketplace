import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AssetNotFoundException } from '../../assets/exceptions/asset-not-found.exception';
import { AssetsService } from '../../assets/services/assets.service';
import { Direction } from '../../common/pagination-filtering/enums/direction.enums';
import { PaginationInfo } from '../../common/pagination-filtering/pagination-info.output';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { CommentEntity } from '../entities/comment.entity';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly assetsService: AssetsService,
  ) {}

  async createComment(
    createCommentInput: CreateCommentInput,
    authorId: UserEntity['id'],
  ) {
    const asset = await this.assetsService.count({
      where: {
        id: createCommentInput.assetId,
      },
    });

    if (!asset) {
      throw new AssetNotFoundException(createCommentInput.assetId);
    }

    return this.commentRepository.createComment(createCommentInput, authorId);
  }

  async getCommentsByAssetIds(
    assetIds: string[],
    paginationArgs: PaginationArgs,
  ) {
    const comments = await this.commentRepository.getCommentsByAssetIds(
      assetIds,
    );

    const commentsByAssetId = this.groupCommentsByAssetId(comments);

    const paginatedComments = this.paginateComments(
      commentsByAssetId,
      paginationArgs,
    );

    return paginatedComments;
  }

  async updateComment(
    updateCommentInput: UpdateCommentInput,
    userId: UserEntity['id'],
  ): Promise<CommentEntity> {
    const { id } = updateCommentInput;

    const comment = await this.commentRepository.findOne({
      where: { id },
      select: ['id', 'authorId'],
    });

    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    this.verifyUserIsAuthor(comment, userId);

    return this.commentRepository.updateComment(updateCommentInput);
  }

  async deleteComment(id: string, userId: UserEntity['id']) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      select: ['id', 'authorId'],
    });

    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    this.verifyUserIsAuthor(comment, userId);

    await this.commentRepository.delete(id);

    return comment;
  }

  private verifyUserIsAuthor(
    comment: Pick<CommentEntity, 'id' | 'authorId'>,
    userId: string,
  ) {
    if (comment.authorId !== userId) {
      throw new UnauthorizedException(
        `You can't update comment with id: ${comment.id}`,
      );
    }
  }

  private paginateComments(
    groupedComments: {
      [key: string]: CommentEntity[];
    },
    paginationArgs: PaginationArgs,
  ): { [key: string]: CommentEntity[] } {
    const { limit, offset, orderBy } = paginationArgs;
    const { direction } = orderBy;

    const paginatedCommentsOutput: Record<string, CommentEntity[]> = {};

    const dateSorter = (a: CommentEntity, b: CommentEntity) => {
      if (direction === Direction.ASC) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    };

    Object.keys(groupedComments).forEach((assetId) => {
      const paginationLimit =
        groupedComments[assetId].length - offset > limit
          ? limit
          : groupedComments[assetId].length - offset;

      const paginatedComments = groupedComments[assetId]
        .sort(dateSorter)
        .slice(offset, paginationLimit);

      const paginationInfo: PaginationInfo = {
        total: groupedComments[assetId].length,
        limit,
        offset,
      };

      paginatedCommentsOutput[assetId] = paginatedComments;
    });

    return paginatedCommentsOutput;
  }

  private groupCommentsByAssetId(comments: CommentEntity[]): {
    [key: string]: CommentEntity[];
  } {
    const commentsByAssetId: Record<string, CommentEntity[]> = {};

    comments.forEach((comment) => {
      if (!commentsByAssetId[comment.assetId]) {
        commentsByAssetId[comment.assetId] = [];
      }
      commentsByAssetId[comment.assetId].push(comment);
    });

    return commentsByAssetId;
  }
}
