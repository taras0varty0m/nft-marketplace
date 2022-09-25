import { Field, InputType } from '@nestjs/graphql';
import { IUpdateComment } from '../types';

@InputType()
export class UpdateCommentInput implements IUpdateComment {
  @Field(() => String)
  id: string;

  @Field(() => String)
  comment: string;
}
