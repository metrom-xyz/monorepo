import { ClaimWithRemaining, QueryOptions, type QueryResult } from "../../types";

export interface UseClaimsSuiParams extends QueryOptions<
    ClaimWithRemaining[] | undefined
> {
    address?: string;
}

export type UseClaimsSuiReturnValue = QueryResult<
    ClaimWithRemaining[] | undefined
>;

export function useClaimsSui(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: UseClaimsSuiParams,
): UseClaimsSuiReturnValue {
    // TODO: not implemented yet, returns an idle result so the useClaims
    // dispatcher can call it unconditionally
    return {
        data: undefined,
        isPending: false,
        isLoading: false,
        isFetching: false,
    };
}
