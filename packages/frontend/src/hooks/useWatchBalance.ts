import { useBlockNumber, useReadContract } from "wagmi";
import { erc20Abi, type Address } from "viem";
import { useEffect } from "react";
import type { HookBaseParams } from "../types/hooks";

interface UseWatchBalanceParams extends HookBaseParams {
    address?: Address;
    token?: Address;
}

export function useWatchBalance({
    address,
    token,
    enabled = true,
}: UseWatchBalanceParams = {}): {
    balance?: bigint;
    loading: boolean;
} {
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const {
        data: balance,
        isLoading: loading,
        refetch,
    } = useReadContract({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: enabled && !!address && !!token },
    });

    useEffect(() => {
        refetch();
    }, [blockNumber, refetch]);

    return {
        balance,
        loading,
    };
}
