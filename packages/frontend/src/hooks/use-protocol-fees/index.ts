import type { HookBaseParams } from "@/src/types/hooks";
import { useChainType } from "../useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useProtocolFeesEvm } from "./useProtocolFeesEvm";
import { useProtocolFeesMvm } from "./useProtocolFeesMvm";
import { useProtocolFeesSvm } from "./useProtocolFeesSvm";
import { useProtocolFeesSui } from "./useProtocolFeesSui";

export interface UseProtocolFeesParams extends HookBaseParams {
    chainId?: number;
}

export interface UseProtocolFeesReturnValue {
    loading: boolean;
    fee?: number;
    feeRebate?: number;
}

export function useProtocolFees(
    params: UseProtocolFeesParams = {},
): UseProtocolFeesReturnValue {
    const chainType = useChainType();

    const feesEvm = useProtocolFeesEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const feesMvm = useProtocolFeesMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const feesSvm = useProtocolFeesSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });
    const feesSui = useProtocolFeesSui({
        ...params,
        enabled: chainType === ChainType.Sui,
    });

    switch (chainType) {
        case ChainType.Evm:
            return feesEvm;
        case ChainType.Aptos:
            return feesMvm;
        case ChainType.Svm:
            return feesSvm;
        case ChainType.Sui:
            return feesSui;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useProtocolFees`,
            );
    }
}
