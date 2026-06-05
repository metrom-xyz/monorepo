import { useReimbursementsEvm } from "./useReimbursementsEvm";
import { useReimbursementsMvm } from "./useReimbursementsMvm";
import type { HookBaseParams } from "@/src/types/hooks";
import type { ReimbursementsWithRemaining } from "@/src/types/campaign/common";
import { useChainType } from "../useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useReimbursementsSvm } from "./useReimbursementsSvm";

export type UseReimbursementsParams = HookBaseParams;

export interface UseReimbursementsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    reimbursements?: ReimbursementsWithRemaining[];
}

export function useReimbursements(
    params: UseReimbursementsParams = {},
): UseReimbursementsReturnValue {
    const chainType = useChainType();

    const reimbursementsEvm = useReimbursementsEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const reimbursementsMvm = useReimbursementsMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const reimbursementsSvm = useReimbursementsSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });

    switch (chainType) {
        case ChainType.Evm:
            return reimbursementsEvm;
        case ChainType.Aptos:
            return reimbursementsMvm;
        case ChainType.Svm:
            return reimbursementsSvm;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useReimbursements`,
            );
    }
}
