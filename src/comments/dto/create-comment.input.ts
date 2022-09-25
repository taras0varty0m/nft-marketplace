import { Field, InputType } from '@nestjs/graphql';
import { ICreateComment } from '../types';

@InputType()
export class CreateCommentInput implements ICreateComment {
  @Field()
  comment: string;

  @Field()
  assetId: string;
}
