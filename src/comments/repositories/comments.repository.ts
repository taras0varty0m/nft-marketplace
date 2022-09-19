import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { CommentEntity } from '../entities/comment.entity';
import { UpdateCommentInput } from './../dto/update-comment.input';

@Injectable()
export class CommentsRepository extends Repository<CommentEntity> {
  constructor(dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  async createComment(
    createCommentInput: CreateCommentInput,
    authorId: UserEntity['id'],
  ) {
    const newComment = this.create({
      ...createCommentInput,
      authorId,
    });

    return this.save(newComment);
  }

  async updateComment(updateCommentInput: UpdateCommentInput) {
    await this.update(updateCommentInput.id, updateCommentInput);

    return this.findOneOrFail({
      where: { id: updateCommentInput.id },
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
