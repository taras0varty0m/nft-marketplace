import { ArgsType, Field } from '@nestjs/graphql';

import { PaginationArgs } from '../../common/pagination-filtering/pagination.args';
import { IAssetSearchArgs } from '../types';

@ArgsType()
export class AssetSearchArgs
  extends PaginationArgs
  implements IAssetSearchArgs
{
  @Field({ nullable: true })
  searchTerm?: string;
}
