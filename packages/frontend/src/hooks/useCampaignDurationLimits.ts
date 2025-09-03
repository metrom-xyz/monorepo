import type { HookBaseParams } from "@/src/types/hooks";
import { useChainId } from "./useChainId";
import { useChainData } from "./useChainData";
import { useReadContracts } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { APTOS } from "@/src/commons/env";
import { useViewModule } from "@aptos-labs/react";
import { useMemo } from "react";

export interface CampaignDurationLimits {
    minimumSeconds: number;
    maximumSeconds: number;
}

export interface UseCampaignDurationLimitsParams extends HookBaseParams {}

export interface UseCampaignDurationReturnValue {
    loading: boolean;
    limits?: CampaignDurationLimits;
}

export function useCampaignDurationLimits({
    enabled,
}: UseCampaignDurationLimitsParams = {}): UseCampaignDurationReturnValue {
    const chainId = useChainId();
    const chainData = useChainData({ chainId });

    const limitsEvm = useReadContracts({
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
            enabled: !APTOS && !!chainData && enabled,
        },
    });

    const minLimitMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::minimum_campaign_duration`,
        },
        enabled: APTOS && !!chainData && enabled,
    });

    const maxLimitMvm = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::maximum_campaign_duration`,
        },
        enabled: APTOS && !!chainData && enabled,
    });

    const loading =
        limitsEvm.isLoading || minLimitMvm.isLoading || maxLimitMvm.isLoading;

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (loading) return undefined;

        if (APTOS && minLimitMvm.data && maxLimitMvm.data)
            return {
                minimumSeconds: Number(minLimitMvm.data[0]),
                maximumSeconds: Number(maxLimitMvm.data[0]),
            };
        if (!APTOS && limitsEvm.data)
            return {
                minimumSeconds: Number(limitsEvm.data[0].result),
                maximumSeconds: Number(limitsEvm.data[1].result),
            };

        return undefined;
    }, [loading, limitsEvm.data, minLimitMvm.data, maxLimitMvm.data]);

    return {
        loading,
        limits,
    };
}
