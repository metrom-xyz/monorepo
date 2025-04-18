import type { Lv2PointsCampaign } from "@/src/types/lv2-points-campaign";
import { SupportedLiquityV2 } from "@metrom-xyz/sdk";

export const lv2PointsCampaignsDev: Record<
    SupportedLiquityV2,
    Lv2PointsCampaign | null
> = {
    [SupportedLiquityV2.Quill]: null,
    [SupportedLiquityV2.Orki]: null,
    [SupportedLiquityV2.Ebisu]: null,
    [SupportedLiquityV2.Liquity]: null,
};
