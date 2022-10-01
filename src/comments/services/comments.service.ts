import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AssetsRepository } from 'src/assets/repositories/assets.repository';
import { Direction } from 'src/common/pagination-filtering/enums/direction.enums';
import { IPaginationArgs } from 'src/common/types';

import { AssetNotFoundException } from '../../assets/exceptions/asset-not-found.exception';
import { PaginationInfo } from '../../common/pagination-filtering/pagination-info.output';
import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';
import { CommentNotFoundException } from '../exceptions/comment-not-found.exception';
import { CommentsRepository } from '../repositories/comments.repository';
import { ICreateComment, IUpdateComment } from '../types';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly assetsRepository: AssetsRepository,
  ) {}

  async createComment(
    createCommentData: ICreateComment,
    authorId: UserEntity['id'],
  ) {
    const asset = await this.assetsRepository.findOne({
      where: {
        id: createCommentData.assetId,
      },
      select: ['id'],
    });

    if (!asset) {
      throw new AssetNotFoundException(createCommentData.assetId);
    }

    return this.commentRepository.createComment(createCommentData, authorId);
  }

  async getCommentsByAssetIds(
    assetIds: string[],
    paginationArgs: IPaginationArgs,
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
    updateCommentData: IUpdateComment,
    userId: UserEntity['id'],
  ): Promise<CommentEntity> {
    const { id } = updateCommentData;

    const comment = await this.commentRepository.findOne({
      where: { id },
      select: ['id', 'authorId'],
    });

    if (!comment) {
      throw new CommentNotFoundException(id);
    }

    this.verifyUserIsAuthor(comment, userId);

    return this.commentRepository.updateComment(updateCommentData);
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
  ): {
    [key: string]: {
      paginationInfo: PaginationInfo;
      comments: CommentEntity[];
    };
  } {
    const { limit, offset, orderBy } = paginationArgs;
    const { direction } = orderBy;

    const paginatedCommentsOutput: Record<
      string,
      {
        paginationInfo: PaginationInfo;
        comments: CommentEntity[];
      }
    > = {};

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

      paginatedCommentsOutput[assetId] = {
        paginationInfo,
        comments: paginatedComments,
      };
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
