import { Field, InputType } from '@nestjs/graphql';
import Coin from '../enums/coin.enum';

@InputType()
export class CreateWalletInput {
  @Field(() => String, {
    description: 'cryptocurrency wallet address',
  })
  address: string;

  @Field(() => Coin, { defaultValue: Coin.Bitcoin })
  coin: Coin;
}
