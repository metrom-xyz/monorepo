import type { ClaimWithRemaining, QueryResult } from "../../types";

export interface UseClaimsTransactionMvmParams {
    claims: ClaimWithRemaining[];
    address?: string;
    enabled?: boolean;
}

export type UseClaimsTransactionMvmReturnValue = QueryResult<undefined> & {
    error: Error | null;
};

export function useClaimsTransactionMvm(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: UseClaimsTransactionMvmParams,
): UseClaimsTransactionMvmReturnValue {
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
