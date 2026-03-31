export interface BaseQueryParams {
  page?: number;
  limit?: number;
  query?: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  hasPrev: boolean;
  hasNext: boolean;
  nextPage: null | number;
  prevPage: null | number;
}
