import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { useEffect } from "react";
import type { UseWatchBalanceParams, UseWatchBalanceReturnValue } from ".";
import { useWatchBlockNumber } from "../use-watch-block-number";

export function useWatchBalanceEvm({
    address,
    token,
    enabled = true,
}: UseWatchBalanceParams = {}): UseWatchBalanceReturnValue {
    const blockNumber = useWatchBlockNumber({ enabled });

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
        if (!enabled) return;
        refetch();
    }, [enabled, blockNumber, refetch]);

    return {
        balance,
        loading,
    };
}
