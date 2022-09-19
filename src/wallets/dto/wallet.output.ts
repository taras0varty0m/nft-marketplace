import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

import Coin from '../enums/coin.enum';

@ObjectType()
export class WalletOutput {
  @Field()
  id: string;

  @Field()
  address: string;

  @Field()
  balance: number;

  @Field(() => User)
  owner: User;

  @Field()
  ownerId: string;

  @Field(() => Coin)
  coin: Coin;
}
