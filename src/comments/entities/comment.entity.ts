import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AssetEntity } from '../../assets/entities/asset.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('comments')
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comment: string;

  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @Column()
  authorId: string;

  @ManyToOne(() => AssetEntity, (asset) => asset.comments)
  asset: AssetEntity;

  @Column()
  assetId: string;
}
