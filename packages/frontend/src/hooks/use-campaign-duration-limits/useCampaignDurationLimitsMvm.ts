import type { HookBaseParams } from "@/src/types/hooks";
import { useChainWithType } from "../useChainWithType";
import { useChainData } from "../useChainData";
import { useViewModule } from "@aptos-labs/react";
import { useMemo } from "react";
import type {
    CampaignDurationLimits,
    UseCampaignDurationReturnValue,
} from ".";

export function useCampaignDurationLimitsMvm({
    enabled = true,
}: HookBaseParams = {}): UseCampaignDurationReturnValue {
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });

    const minLimit = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::minimum_campaign_duration`,
        },
        enabled: !!chainData && enabled,
    });
    const maxLimit = useViewModule({
        payload: {
            function: `${chainData?.metromContract.address}::metrom::maximum_campaign_duration`,
        },
        enabled: !!chainData && enabled,
    });

    const limits: CampaignDurationLimits | undefined = useMemo(() => {
        if (minLimit.isLoading || maxLimit.isLoading) return undefined;
        if (!minLimit.data || !maxLimit.data) return undefined;
        return {
            minimumSeconds: Number(minLimit.data[0]),
            maximumSeconds: Number(maxLimit.data[0]),
        };
    }, [
        minLimit.data,
        minLimit.isLoading,
        maxLimit.data,
        maxLimit.isLoading,
    ]);

    return { loading: minLimit.isLoading || maxLimit.isLoading, limits };
}
