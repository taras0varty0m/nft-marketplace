import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationInfo } from '../../common/pagination-filtering/pagination-info.output';
import { Comment } from './../models/comment.model';

@ObjectType()
export class PaginatedComments {
  @Field(() => PaginationInfo, {
    nullable: true,
  })
  paginationInfo?: PaginationInfo;

  @Field(() => [Comment], { nullable: true })
  comments?: [Comment];
}
