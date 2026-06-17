import { useAccount } from "wagmi";
import { useChainData } from "../useChainData";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { zeroAddress } from "viem";
import { useMemo } from "react";
import type { UseProtocolFeesParams, UseProtocolFeesReturnValue } from ".";

export function useProtocolFeesEvm({
    chainId,
    enabled = true,
}: UseProtocolFeesParams = {}): UseProtocolFeesReturnValue {
    const chainData = useChainData({ chainId });
    const { address } = useAccount();

    const { data, isLoading } = useReadContracts({
        contracts: [
            {
                abi: metromAbi,
                chainId,
                address: chainData?.metromContract.address,
                functionName: "fee",
            },
            {
                abi: metromAbi,
                chainId,
                address: chainData?.metromContract.address,
                functionName: "feeRebate",
                args: [address || zeroAddress],
            },
        ],
        query: {
            enabled: !!chainData && enabled,
        },
    });

    const fees = useMemo(() => {
        if (isLoading || !data) return undefined;
        return {
            fee:
                data[0].result !== undefined
                    ? Number(data[0].result)
                    : undefined,
            feeRebate:
                data[1].result !== undefined ? Number(data[1].result) : 0,
        };
    }, [data, isLoading]);

    return { loading: isLoading, ...fees };
}
