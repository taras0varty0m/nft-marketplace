import { PaginationArgs } from 'src/common/pagination-filtering/pagination.args';

export interface ICreateAsset {
  title: string;

  description: string;

  category: string;

  price: number;
}

export interface IAssetSearchArgs extends PaginationArgs {
  searchTerm: string;
}
