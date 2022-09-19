import { WalletEntity } from 'src/wallets/entities/wallet.entity';
import { define } from 'typeorm-seeding';

define(WalletEntity, () => {
  const wallet = new WalletEntity();
  wallet.balance = 20000;
  return wallet;
});
