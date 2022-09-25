import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { IPaginationArgs } from '../types';

import { OrderBy } from './order-by.input';

@ArgsType()
export class PaginationArgs implements IPaginationArgs {
  @Field({ defaultValue: 10 })
  @Min(1)
  limit: number;

  @Field({ defaultValue: 0 })
  @Min(0)
  offset: number;

  @Field(() => OrderBy, {
    defaultValue: { field: 'createdAt', sortOrder: 'DESC' },
  })
  orderBy: OrderBy;
}
