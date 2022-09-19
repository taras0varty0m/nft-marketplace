import { ArgsType, Field } from '@nestjs/graphql';

import { PaginationArgs } from './pagination.args';

@ArgsType()
export class AssetSearchArgs extends PaginationArgs {
  @Field()
  searchTerm: string;
}
