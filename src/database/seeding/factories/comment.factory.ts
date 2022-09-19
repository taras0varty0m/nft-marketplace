import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { CommentEntity } from './../../../comments/entities/comment.entity';

define(CommentEntity, () => {
  const comment = new CommentEntity();
  comment.comment = faker.lorem.sentence();
  return comment;
});
