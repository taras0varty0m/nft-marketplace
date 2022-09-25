import { Field, InputType } from '@nestjs/graphql';
import { IsAlphanumeric, Length } from 'class-validator';
import { ILoginUser } from '../types';

@InputType()
export class LoginInput implements ILoginUser {
  @Field()
  @IsAlphanumeric()
  @Length(4, 20)
  nickname: string;

  @Field()
  @Length(6, 20)
  password: string;
}
