import type { HookBaseParams } from "@/src/types/hooks";
import { useChainWithType } from "../useChainWithType";
import { useChainData } from "../useChainData";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useMemo } from "react";
import type {
    CampaignDurationLimits,
    UseCampaignDurationReturnValue,
} from ".";

export function useCampaignDurationLimitsEvm({
    enabled = true,
}: HookBaseParams = {}): UseCampaignDurationReturnValue {
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });

    const { data, isLoading } = useReadContracts({
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
            enabled: !!chainData && enabled,
        },
    });

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (isLoading || !data) return undefined;
        return {
            minimumSeconds: Number(data[0].result),
            maximumSeconds: Number(data[1].result),
        };
    }, [data, isLoading]);

    return { loading: isLoading, limits };
}
