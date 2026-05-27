import {
    ChainType,
    type OnChainAmount,
    type UsdPricedErc20Token,
} from "@metrom-xyz/sdk";
import { type Address } from "viem";
import type { HookBaseParams } from "../../types/hooks";
import { useWatchBalancesEvm } from "./useWatchBalancesEvm";
import { useWatchBalancesMvm } from "./useWatchBalancesMvm";
import { useChainType } from "../useChainType";
import { useWatchBalancesSvm } from "./useWatchBalancesSvm";

export interface Erc20TokenWithBalance<T extends UsdPricedErc20Token> {
    token: T;
    balance: OnChainAmount | null;
}

export interface UseWatchBalancesParams<T> extends HookBaseParams {
    chainId?: number;
    address?: Address;
    tokens?: T[];
}

export interface UseWatchBalancesReturnValue<T extends UsdPricedErc20Token> {
    tokensWithBalance: Erc20TokenWithBalance<T>[];
    loading: boolean;
}

export function useWatchBalances<T extends UsdPricedErc20Token>(
    params: UseWatchBalancesParams<T> = {},
): UseWatchBalancesReturnValue<T> {
    const chainType = useChainType();

    const balancesEvm = useWatchBalancesEvm({
        ...params,
        enabled: chainType === ChainType.Evm,
    });
    const balancesMvm = useWatchBalancesMvm({
        ...params,
        enabled: chainType === ChainType.Aptos,
    });
    const balancesSvm = useWatchBalancesSvm({
        ...params,
        enabled: chainType === ChainType.Svm,
    });

    switch (chainType) {
        case ChainType.Evm:
            return balancesEvm;
        case ChainType.Aptos:
            return balancesMvm;
        case ChainType.Svm:
            return balancesSvm;
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
