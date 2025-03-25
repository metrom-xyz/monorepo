import type {
    DefaultError,
    QueryKey,
    UseQueryOptions,
} from "@tanstack/react-query";

export interface QueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> {
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn"
    >;
}

export interface QueryResult<TData = unknown> {
    data: TData;
    isPending: boolean;
    isLoading: boolean;
    isFetching: boolean;
}
