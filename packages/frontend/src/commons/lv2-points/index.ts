import type { Lv2PointsCampaigns } from "@/src/types/lv2-points-campaign";
import { Environment, SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { lv2PointsCampaignsDev } from "./lv2-dev";
import { lv2PointsCampaignsProd } from "./lv2-prod";

export const LV2_POINTS_CAMPAIGNS: Record<Environment, Lv2PointsCampaigns> = {
    [Environment.Development]: lv2PointsCampaignsDev,
    [Environment.Production]: lv2PointsCampaignsProd,
};

export const LV2_SERVICE_BASE_URLS: Record<
    Environment,
    (protocol: SupportedLiquityV2) => string
> = {
    [Environment.Development]: (protocol) =>
        `https://${protocol}.dev.metrom.xyz/`,
    [Environment.Production]: (protocol) => `https://${protocol}.metrom.xyz/`,
};
