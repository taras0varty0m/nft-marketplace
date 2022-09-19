import { registerEnumType } from '@nestjs/graphql';

enum Coin {
  Bitcoin = 'Bitcoin',
}

export default Coin;

registerEnumType(Coin, { name: 'Coin', description: 'Coin type' });
