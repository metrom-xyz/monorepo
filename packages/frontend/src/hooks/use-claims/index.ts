import { useClaimsEvm } from "./useClaimsEvm";
import { useClaimsMvm } from "./useClaimsMvm";
import type { HookBaseParams } from "@/src/types/hooks";
import type { ClaimWithRemaining } from "@/src/types/campaign/common";
import { useChainType } from "../useChainType";
import { useClaimsSvm } from "./useClaimsSvm";
import { useClaimsSui } from "./useClaimsSui";
import { ChainType } from "@metrom-xyz/sdk";

export type UseClaimsParams = HookBaseParams;

export interface UseClaimsReturnValue {
    loading: boolean;
    invalidate: () => Promise<void>;
    claims?: ClaimWithRemaining[];
}

export function useClaims(params: UseClaimsParams = {}): UseClaimsReturnValue {
    const chainType = useChainType();

    const claimsEvm = useClaimsEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const claimsMvm = useClaimsMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const claimsSvm = useClaimsSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });

    const claimsSui = useClaimsSui({
        ...params,
        enabled: chainType === ChainType.Sui,
    });

    switch (chainType) {
        case ChainType.Evm:
            return claimsEvm;
        case ChainType.Aptos:
            return claimsMvm;
        case ChainType.Svm:
            return claimsSvm;
        case ChainType.Sui:
            return claimsSui;
        default:
            throw new Error(`Unsupported chain type ${chainType} in useClaims`);
    }
}
