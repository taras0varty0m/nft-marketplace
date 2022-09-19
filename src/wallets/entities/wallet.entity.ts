import { UserEntity } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import Coin from '../enums/coin.enum';

@Entity('wallets')
@Check('"balance" >= 0')
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 0 })
  balance: number;

  @OneToOne(() => UserEntity, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: UserEntity;

  @Column()
  ownerId: string;

  @Column({ default: Coin.Bitcoin })
  coin: string;
}
