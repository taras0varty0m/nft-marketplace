import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/graphql-jwt-auth.guard';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { Comment } from '../models/comment.model';
import { CommentsService } from '../services/comments.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.commentsService.createComment(createCommentInput, userId);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.commentsService.updateComment(updateCommentInput, userId);
  }

  @Mutation(() => Comment)
  async deleteComment(
    @Args('commentId', { type: () => String }) commentId: string,
    @CurrentUser() { id: userId }: UserEntity,
  ) {
    return this.commentsService.deleteComment(commentId, userId);
  }
}
