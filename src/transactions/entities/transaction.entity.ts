import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AssetEntity } from '../../assets/entities/asset.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coin: string;

  @Column({ type: 'numeric', precision: 15, scale: 6 })
  amount: number;

  @ManyToOne(() => AssetEntity)
  @JoinColumn()
  asset: AssetEntity;

  @Column()
  assetId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  buyer: UserEntity;

  @Column()
  buyerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  seller: UserEntity;

  @Column()
  sellerId: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
