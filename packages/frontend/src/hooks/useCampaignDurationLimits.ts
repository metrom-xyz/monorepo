import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";
import { useChainData } from "./useChainData";

interface CampaignDurationLimits {
    minimumSeconds: number;
    maximumSeconds: number;
}

export function useCampaignDurationLimits(): {
    loading: boolean;
    limits?: CampaignDurationLimits;
} {
    const chainId = useChainId();
    const chainData = useChainData(chainId);

    // TODO: fetching these in one single call would be better
    const { data: minimumSeconds, isLoading: loadingMinimumDuration } =
        useReadContract({
            address: chainData?.metromContract.address,
            abi: metromAbi,
            functionName: "minimumCampaignDuration",
        });
    const { data: maximumSeconds, isLoading: loadingMaximumDuration } =
        useReadContract({
            address: chainData?.metromContract.address,
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
