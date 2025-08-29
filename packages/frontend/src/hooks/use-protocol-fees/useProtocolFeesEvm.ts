import { useAccount, useReadContract } from "wagmi";
import type { UseProtocolFeesParams, UseProtocolFeesReturnValue } from ".";
import { useChainId } from "../use-chain-id";
import { useChainData } from "../useChainData";
import { metromAbi } from "@metrom-xyz/contracts/abi";

export function useProtocolFeesEvm({
    enabled = true,
}: UseProtocolFeesParams): UseProtocolFeesReturnValue {
    const chainId = useChainId();
    const chainData = useChainData({ chainId });
    const { address } = useAccount();

    const { data: fee, isLoading: loadingFee } = useReadContract({
        address: chainData?.metromContract.address,
        abi: metromAbi,
        functionName: "fee",
        query: { enabled: enabled && !!chainData },
    });

    const { data: feeRebate, isLoading: loadingFeeRebate } = useReadContract({
        address: chainData?.metromContract.address,
        abi: metromAbi,
        functionName: "feeRebate",
        args: address && [address],
        query: { enabled: enabled && !!address },
    });

    return {
        loading: loadingFee || loadingFeeRebate,
        fee,
        feeRebate,
    };
}
