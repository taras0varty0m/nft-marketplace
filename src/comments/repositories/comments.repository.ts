import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';
import { ICreateComment, IUpdateComment } from '../types';

@Injectable()
export class CommentsRepository extends Repository<CommentEntity> {
  constructor(dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  async createComment(
    createCommentData: ICreateComment,
    authorId: UserEntity['id'],
  ) {
    const newComment = this.create({
      ...createCommentData,
      authorId,
    });

    return this.save(newComment);
  }

  async updateComment(updateCommentData: IUpdateComment) {
    await this.update(updateCommentData.id, updateCommentData);

    return this.findOneOrFail({
      where: { id: updateCommentData.id },
      relations: ['author', 'asset'],
    });
  }

  async getCommentsByAssetIds(assetIds: string[]) {
    return this.find({
      where: {
        asset: {
          id: In(assetIds),
        },
      },
      relations: ['author', 'asset'],
    });
  }
}
