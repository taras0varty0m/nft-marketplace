import { Field, ObjectType } from '@nestjs/graphql';
import { DateResolver } from 'graphql-scalars';

import Gender from '../enums/gender.enum';

@ObjectType()
export class UserProfileOutput {
  @Field()
  id: string;

  @Field()
  nickname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  aboutMe?: string;

  @Field(() => DateResolver)
  birthDate: Date;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
