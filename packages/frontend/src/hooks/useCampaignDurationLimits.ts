import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import { useChainId, useReadContracts } from "wagmi";
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

    const { data, isLoading: loadingDurationLimits } = useReadContracts({
        contracts: [
            {
                abi: metromAbi,
                address: chainData?.metromContract.address,
                functionName: "minimumCampaignDuration",
            },
            {
                abi: metromAbi,
                address: chainData?.metromContract.address,
                functionName: "maximumCampaignDuration",
            },
        ],
    });
    const minimumSeconds = data?.[0].result;
    const maximumSeconds = data?.[1].result;

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (loadingDurationLimits || !minimumSeconds || !maximumSeconds)
            return undefined;

        return {
            minimumSeconds,
            maximumSeconds,
        };
    }, [loadingDurationLimits, maximumSeconds, minimumSeconds]);

    return {
        loading: loadingDurationLimits,
        limits,
    };
}
