import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssetsModule } from '../assets/assets.module';
import { UsersModule } from '../users/users.module';
import { CommentEntity } from './entities/comment.entity';
import { CommentsRepository } from './repositories/comments.repository';
import { CommentsResolver } from './resolvers/comments.resolver';
import { CommentsService } from './services/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    UsersModule,
    forwardRef(() => AssetsModule),
  ],
  providers: [CommentsResolver, CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
