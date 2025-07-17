import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { useChainData } from "../useChainData";
import { useChainId } from "../use-chain-id";
import type {
    CampaignDurationLimits,
    UseCampaignDurationLimitsParams,
    UseCampaignDurationReturnValue,
} from "./types";

export function useCampaignDurationLimitsEvm({
    enabled = true,
}: UseCampaignDurationLimitsParams = {}): UseCampaignDurationReturnValue {
    const chainId = useChainId();
    const chainData = useChainData({ chainId });

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
        query: {
            enabled,
        },
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
