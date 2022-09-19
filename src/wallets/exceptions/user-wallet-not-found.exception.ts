import { NotFoundException } from '@nestjs/common';

export class UserWalletNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`User with id: ${userId} wallet not found`);
  }
}
