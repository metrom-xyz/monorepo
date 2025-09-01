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

    const evmLimits = useReadContracts({
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

    const mvmMinLimit = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::minimum_campaign_duration`,
        },
        enabled: APTOS && !!chainData && enabled,
    });

    const mvmMaxLimit = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::maximum_campaign_duration`,
        },
        enabled: APTOS && !!chainData && enabled,
    });

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (
            evmLimits.isLoading ||
            mvmMinLimit.isLoading ||
            mvmMaxLimit.isLoading
        )
            return undefined;

        if (APTOS && mvmMinLimit.data && mvmMaxLimit.data) {
            return {
                minimumSeconds: Number(mvmMinLimit.data[0]),
                maximumSeconds: Number(mvmMaxLimit.data[0]),
            };
        }
        if (!APTOS && evmLimits.data) {
            return {
                minimumSeconds: Number(evmLimits.data[0].result),
                maximumSeconds: Number(evmLimits.data[1].result),
            };
        }

        return undefined;
    }, [
        evmLimits.isLoading,
        evmLimits.data,
        mvmMinLimit.isLoading,
        mvmMinLimit.data,
        mvmMaxLimit.isLoading,
        mvmMaxLimit.data,
    ]);

    return {
        loading:
            evmLimits.isLoading ||
            mvmMinLimit.isLoading ||
            mvmMaxLimit.isLoading,
        limits,
    };
}
