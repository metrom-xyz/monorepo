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
