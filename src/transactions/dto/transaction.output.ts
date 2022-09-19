import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import Coin from 'src/wallets/enums/coin.enum';

import { Asset } from '../../assets/models/asset.model';
import { UserProfileOutput } from '../../users/dto/user-profile.output';

@ObjectType()
export class TransactionOutput {
  @Field()
  id: string;

  @Field(() => Coin)
  coin: Coin;

  @Field()
  amount: number;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => Asset)
  asset: Asset;

  @Field()
  assetId: string;

  @Field()
  buyer: UserProfileOutput;

  @Field()
  seller: UserProfileOutput;
}
