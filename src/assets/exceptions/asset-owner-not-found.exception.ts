import { NotFoundException } from '@nestjs/common';

export class AssetOwnerNotFoundException extends NotFoundException {
  constructor(assetId: string) {
    super(`Asset with id: ${assetId} owner not found`);
  }
}
