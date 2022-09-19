import { Exclude } from 'class-transformer';
import { Role } from 'src/auth/enums/role.enum';
import { WalletEntity } from 'src/wallets/entities/wallet.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AssetEntity } from '../../assets/entities/asset.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  aboutMe?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  gender: string;

  @OneToMany(() => AssetEntity, (asset) => asset.owner)
  assets?: AssetEntity[];

  @OneToOne(() => WalletEntity)
  @JoinColumn()
  wallet?: WalletEntity;

  @Column({ nullable: true })
  walletId?: string;

  @Column({ default: Role.USER })
  role: string;
}
