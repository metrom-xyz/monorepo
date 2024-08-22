import { useBlockNumber, useReadContract } from "wagmi";
import { erc20Abi, type Address } from "viem";
import { useEffect } from "react";

export function useWatchBalance(
    address?: Address,
    token?: Address,
): {
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
        query: { enabled: !!address && !!token },
    });

    useEffect(() => {
        refetch();
    }, [blockNumber, refetch]);

    return {
        balance,
        loading,
    };
}
