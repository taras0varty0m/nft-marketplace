import { Field, InputType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';
import { DateResolver } from 'graphql-scalars';
import { IRegisterUser } from 'src/auth/types';

import Gender from '../enums/gender.enum';

@InputType()
export class RegisterUserInput implements IRegisterUser {
  @Field()
  @IsAlphanumeric()
  @Length(4, 20)
  nickname: string;

  @Field()
  @Length(1, 60)
  firstName: string;

  @Field()
  @Length(1, 60)
  lastName: string;

  @Field()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Field()
  @IsAlphanumeric()
  @Length(6, 20)
  password: string;

  @Field(() => DateResolver)
  @IsDate()
  birthDate: Date;

  @Field(() => Gender, { nullable: true })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
