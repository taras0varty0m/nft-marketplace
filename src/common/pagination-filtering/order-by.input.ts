import { Field, InputType } from '@nestjs/graphql';

import { Direction } from './enums/direction.enums';

@InputType()
export class OrderBy {
  @Field({ defaultValue: 'createdAt' })
  field: string;

  @Field({ defaultValue: Direction.DESC })
  direction: Direction;
}
