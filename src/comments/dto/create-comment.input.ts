import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  comment: string;

  @Field()
  assetId: string;
}
