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

import Gender from '../enums/gender.enum';
import { IUpdateUser } from '../types';

@InputType()
export class UpdateUserInput implements IUpdateUser {
  @Field({ nullable: true })
  @IsAlphanumeric()
  @Length(4, 20)
  @IsOptional()
  nickname?: string;

  @Field({ nullable: true })
  @Length(1, 60)
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @Length(1, 60)
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @MaxLength(254)
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @Length(1, 1000)
  @IsOptional()
  aboutMe?: string;

  @Field(() => DateResolver, { nullable: true })
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @Field(() => Gender, { nullable: true })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}
