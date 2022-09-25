import { Direction } from './pagination-filtering/enums/direction.enums';

export interface IPaginationArgs {
  limit: number;

  offset: number;

  orderBy: IOrderBy;
}

export interface IOrderBy {
  field: string;

  direction: Direction;
}
