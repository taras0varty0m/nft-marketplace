import { NotFoundException } from '@nestjs/common';

export class WalletNotFoundException extends NotFoundException {
  constructor(walletId: string) {
    super(`Wallet with id: ${walletId} not found`);
  }
}
