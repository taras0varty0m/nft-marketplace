import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommentEntity } from '../../comments/entities/comment.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('assets')
@Check('"price" >= 0')
export class AssetEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', precision: 15, scale: 6, default: 0 })
  price: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastSaleAt?: Date;

  @Column()
  category: string;

  @ManyToOne(() => UserEntity, (user) => user.assets, { onDelete: 'CASCADE' })
  owner: UserEntity;

  @Column()
  ownerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  creator: UserEntity;

  @Column()
  creatorId: string;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.asset, {
    nullable: true,
  })
  comments?: CommentEntity[];
}
