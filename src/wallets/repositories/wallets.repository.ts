import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { WalletEntity } from '../entities/wallet.entity';

@Injectable()
export class WalletsRepository extends Repository<WalletEntity> {
  constructor(dataSource: DataSource) {
    super(WalletEntity, dataSource.createEntityManager());
  }
}
