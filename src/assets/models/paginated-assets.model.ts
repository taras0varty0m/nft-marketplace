import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationInfo } from '../../common/pagination-filtering/pagination-info.output';
import { Asset } from './asset.model';

@ObjectType()
export class PaginatedAssets {
  @Field({ nullable: true })
  paginationInfo?: PaginationInfo;

  @Field(() => [Asset])
  assets: [Asset];
}
