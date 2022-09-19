import { Field, ObjectType } from '@nestjs/graphql';
import { DateResolver } from 'graphql-scalars';

import { Asset } from '../../assets/models/asset.model';
import Gender from '../enums/gender.enum';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  nickname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  aboutMe?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => DateResolver)
  birthDate: Date;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => [Asset])
  assets?: Asset[];
}
