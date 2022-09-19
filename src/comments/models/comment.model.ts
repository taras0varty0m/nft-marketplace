import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

import { Asset } from '../../assets/models/asset.model';
import { UserProfileOutput } from '../../users/dto/user-profile.output';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  comment: string;

  @Field(() => UserProfileOutput, { nullable: true })
  author?: UserProfileOutput;

  @Field({ nullable: true })
  authorId?: string;

  @Field(() => Asset)
  asset: Asset;

  @Field()
  assetId: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
