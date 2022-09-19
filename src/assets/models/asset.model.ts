import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

import { UserProfileOutput } from '../../users/dto/user-profile.output';
import { PaginatedComments } from './../../comments/dto/paginated-comments.output';

@ObjectType()
export class Asset {
  @Field()
  id: string;

  @Field()
  imageUrl: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: string;

  @Field({ nullable: true })
  lastSale?: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field({ nullable: true })
  category?: string;

  @Field(() => UserProfileOutput, { nullable: true })
  creator?: UserProfileOutput;

  @Field({ nullable: true })
  creatorId?: string;

  @Field(() => UserProfileOutput)
  owner: UserProfileOutput;

  @Field()
  ownerId: string;

  @Field(() => PaginatedComments, { nullable: true })
  comments?: PaginatedComments;
}
