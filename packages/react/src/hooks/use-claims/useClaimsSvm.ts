import { ClaimWithRemaining, QueryOptions, type QueryResult } from "../../types";

export interface UseClaimsSvmParams extends QueryOptions<
    ClaimWithRemaining[] | undefined
> {
    address?: string;
}

export type UseClaimsSvmReturnValue = QueryResult<
    ClaimWithRemaining[] | undefined
>;

export function useClaimsSvm(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: UseClaimsSvmParams,
): UseClaimsSvmReturnValue {
    // TODO: not implemented yet, returns an idle result so the useClaims
    // dispatcher can call it unconditionally
    return {
        data: undefined,
        isPending: false,
        isLoading: false,
        isFetching: false,
    };
}
