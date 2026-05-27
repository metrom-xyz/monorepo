import { type Address } from "viem";
import type { HookBaseParams } from "../../types/hooks";
import { useWatchBalanceEvm } from "./useWatchBalanceEvm";
import { useWatchBalanceMvm } from "./useWatchBalanceMvm";
import { useChainType } from "../useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useWatchBalanceSvm } from "./useWatchBalanceSvm";

export interface UseWatchBalanceParams extends HookBaseParams {
    address?: Address;
    token?: Address;
    chainId?: number;
}

export interface UseWatchBalanceReturnValue {
    balance?: bigint;
    loading: boolean;
}

export function useWatchBalance(params: UseWatchBalanceParams = {}): {
    balance?: bigint;
    loading: boolean;
} {
    const chainType = useChainType();

    const balanceEvm = useWatchBalanceEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const balanceMvm = useWatchBalanceMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const balanceSvm = useWatchBalanceSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });

    switch (chainType) {
        case ChainType.Evm:
            return balanceEvm;
        case ChainType.Aptos:
            return balanceMvm;
        case ChainType.Svm:
            return balanceSvm;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useWatchBalance`,
            );
    }
}
