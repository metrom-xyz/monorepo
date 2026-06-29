import {
    ChainType,
    type OnChainAmount,
    type UsdPricedErc20Token,
} from "@metrom-xyz/sdk";
import type { HookBaseParams } from "../../types/hooks";
import { useWatchBalancesEvm } from "./useWatchBalancesEvm";
import { useWatchBalancesMvm } from "./useWatchBalancesMvm";
import { useChainType } from "../useChainType";
import { useWatchBalancesSvm } from "./useWatchBalancesSvm";
import { useWatchBalancesSui } from "./useWatchBalancesSui";

export interface Erc20TokenWithBalance<T extends UsdPricedErc20Token> {
    token: T;
    balance: OnChainAmount | null;
}

export interface UseWatchBalancesParams<T> extends HookBaseParams {
    chainId?: number;
    address?: string;
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
    const balancesSui = useWatchBalancesSui({
        ...params,
        enabled: chainType === ChainType.Sui,
    });

    switch (chainType) {
        case ChainType.Evm:
            return balancesEvm;
        case ChainType.Aptos:
            return balancesMvm;
        case ChainType.Svm:
            return balancesSvm;
        case ChainType.Sui:
            return balancesSui;
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useWatchBalances`,
            );
    }
}
