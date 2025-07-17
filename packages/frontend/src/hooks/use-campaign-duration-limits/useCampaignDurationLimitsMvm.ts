import { useMemo } from "react";
import { useChainData } from "../useChainData";
import { useChainId } from "../use-chain-id";
import type {
    CampaignDurationLimits,
    UseCampaignDurationLimitsParams,
    UseCampaignDurationReturnValue,
} from ".";
import { useViewModule } from "@aptos-labs/react";

export function useCampaignDurationLimitsMvm({
    enabled = true,
}: UseCampaignDurationLimitsParams = {}): UseCampaignDurationReturnValue {
    const chainId = useChainId();
    const chainData = useChainData({ chainId });

    const { data: minDuration, isLoading: loadingMinDuration } = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::minimum_campaign_duration`,
        },
        enabled: !!chainData && enabled,
    });

    const { data: maxDuration, isLoading: loadingMaxDuration } = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::maximum_campaign_duration`,
        },
        enabled: !!chainData && enabled,
    });

    const minimumSeconds = minDuration?.[0];
    const maximumSeconds = maxDuration?.[0];

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (
            loadingMinDuration ||
            loadingMaxDuration ||
            !minimumSeconds ||
            !maximumSeconds
        )
            return undefined;

        return {
            minimumSeconds: Number(minimumSeconds),
            maximumSeconds: Number(maximumSeconds),
        };
    }, [
        loadingMinDuration,
        loadingMaxDuration,
        maximumSeconds,
        minimumSeconds,
    ]);

    return {
        loading: loadingMinDuration || loadingMaxDuration,
        limits,
    };
}
