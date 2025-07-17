import { useCampaignDurationLimitsEvm } from "./useCampaignDurationLimitsEvm";
import { APTOS } from "@/src/commons/env";
import { useCampaignDurationLimitsMvm } from "./useCampaignDurationLimitsMvm";
import type { HookBaseParams } from "@/src/types/hooks";

export interface CampaignDurationLimits {
    minimumSeconds: number;
    maximumSeconds: number;
}

export interface UseCampaignDurationLimitsParams extends HookBaseParams {}

export interface UseCampaignDurationReturnValue {
    loading: boolean;
    limits?: CampaignDurationLimits;
}

export function useCampaignDurationLimits(
    params: UseCampaignDurationLimitsParams = {},
): UseCampaignDurationReturnValue {
    const durationLimitsEvm = useCampaignDurationLimitsEvm({
        ...params,
        enabled: !APTOS,
    });
    const durationLimitsMvm = useCampaignDurationLimitsMvm({
        ...params,
        enabled: APTOS,
    });

    if (APTOS) return durationLimitsMvm;
    return durationLimitsEvm;
}
