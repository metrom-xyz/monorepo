import type { OnChainAmount, UsdPricedErc20Token } from "@metrom-xyz/sdk";
import { type Address } from "viem";
import type { HookBaseParams } from "../../types/hooks";
import { APTOS } from "@/src/commons/env";
import { useWatchBalancesEvm } from "./useWatchBalancesEvm";
import { useWatchBalancesMvm } from "./useWatchBalancesMvm";

export interface Erc20TokenWithBalance<T extends UsdPricedErc20Token> {
    token: T;
    balance: OnChainAmount | null;
}

export interface UseWatchBalancesParams<T> extends HookBaseParams {
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
    const balancesEvm = useWatchBalancesEvm({ ...params, enabled: !APTOS });
    const balancesMvm = useWatchBalancesMvm({ ...params, enabled: APTOS });

    if (APTOS) return balancesMvm;
    return balancesEvm;
}
