export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface Sorting {
  orderBy: string;
  orderDirection: "asc" | "desc";
}
