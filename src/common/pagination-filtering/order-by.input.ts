import { Field, InputType } from '@nestjs/graphql';
import { IOrderBy } from '../types';

import { Direction } from './enums/direction.enums';

@InputType()
export class OrderBy implements IOrderBy {
  @Field({ defaultValue: 'createdAt' })
  field: string;

  @Field({ defaultValue: Direction.DESC })
  direction: Direction;
}
