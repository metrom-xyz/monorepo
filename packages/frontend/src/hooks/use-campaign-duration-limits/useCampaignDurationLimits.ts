import type {
    UseCampaignDurationLimitsParams,
    UseCampaignDurationReturnValue,
} from "./types";
import { useCampaignDurationLimitsEvm } from "./useCampaignDurationLimitsEvm";
import { APTOS } from "@/src/commons/env";
import { useCampaignDurationLimitsMvm } from "./useCampaignDurationLimitsMvm";

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
