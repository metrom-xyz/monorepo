import type { ClaimWithRemaining, QueryResult } from "../../types";

export interface UseClaimsTransactionSvmParams {
    claims: ClaimWithRemaining[];
    address?: string;
    enabled?: boolean;
}

export type UseClaimsTransactionSvmReturnValue = QueryResult<undefined> & {
    error: Error | null;
};

export function useClaimsTransactionSvm(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: UseClaimsTransactionSvmParams,
): UseClaimsTransactionSvmReturnValue {
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
