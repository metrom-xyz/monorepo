import { type Address } from "viem";
import type { HookBaseParams } from "../../types/hooks";
import { useWatchBalanceEvm } from "./useWatchBalanceEvm";
import { useWatchBalanceMvm } from "./useWatchBalanceMvm";
import { APTOS } from "@/src/commons/env";

export interface UseWatchBalanceParams extends HookBaseParams {
    address?: Address;
    token?: Address;
}

export interface UseWatchBalanceReturnValue {
    balance?: bigint;
    loading: boolean;
}

export function useWatchBalance(params: UseWatchBalanceParams = {}): {
    balance?: bigint;
    loading: boolean;
} {
    const balanceEvm = useWatchBalanceEvm({ ...params, enabled: !APTOS });
    const balanceMvm = useWatchBalanceMvm({ ...params, enabled: APTOS });

    if (APTOS) return balanceMvm;
    return balanceEvm;
}
