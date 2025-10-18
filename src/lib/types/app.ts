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

export type OptimisticUpdateResult<TData> = {
  queryKey: string[];
  oldData?: TData;
  newData?: TData;
};
