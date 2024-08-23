import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_DATA } from "../commons";

interface CampaignDurationLimits {
    minimumSeconds: number;
    maximumSeconds: number;
}

export function useCampaignDurationLimits(): {
    loading: boolean;
    limits?: CampaignDurationLimits;
} {
    const chain: SupportedChain = useChainId();

    const { data: minimumSeconds, isLoading: loadingMinimumDuration } =
        useReadContract({
            address: CHAIN_DATA[chain].contract.address,
            abi: metromAbi,
            functionName: "minimumCampaignDuration",
        });
    const { data: maximumSeconds, isLoading: loadingMaximumDuration } =
        useReadContract({
            address: CHAIN_DATA[chain].contract.address,
            abi: metromAbi,
            functionName: "maximumCampaignDuration",
        });

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (
            loadingMinimumDuration ||
            loadingMaximumDuration ||
            !minimumSeconds ||
            !maximumSeconds
        )
            return undefined;

        return {
            minimumSeconds,
            maximumSeconds,
        };
    }, [
        loadingMaximumDuration,
        loadingMinimumDuration,
        maximumSeconds,
        minimumSeconds,
    ]);

    return {
        loading: loadingMinimumDuration || loadingMaximumDuration,
        limits,
    };
}
