export interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

export interface Sorting {
  orderBy: string;
  orderDirection: "asc" | "desc";
}
