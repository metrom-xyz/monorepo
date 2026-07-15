import type { ClaimWithRemaining, QueryResult } from "../../types";

export interface UseClaimsTransactionSuiParams {
    claims: ClaimWithRemaining[];
    address?: string;
    enabled?: boolean;
}

export type UseClaimsTransactionSuiReturnValue = QueryResult<undefined> & {
    error: Error | null;
};

export function useClaimsTransactionSui(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: UseClaimsTransactionSuiParams,
): UseClaimsTransactionSuiReturnValue {
    // TODO: not implemented yet, returns an idle result so the
    // useClaimsTransaction dispatcher can call it unconditionally
    return {
        data: undefined,
        error: null,
        isPending: false,
        isLoading: false,
        isFetching: false,
    };
}
