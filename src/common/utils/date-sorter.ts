import { Direction } from '../pagination-filtering/enums/direction.enums';

export const dateSorter =
  (direction: Direction) => (a: { createdAt: Date }, b: { createdAt: Date }) =>
    direction === Direction.ASC
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime();
