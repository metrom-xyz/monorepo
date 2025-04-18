import { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { QuillLogo } from "@/src/assets/logos/liquity-v2-platforms/quill";
import {
    Lv2PointsCampaign2Action,
    type Lv2PointsCampaign,
} from "@/src/types/lv2-points-campaign";

export const lv2PointsCampaignsProd: Record<
    SupportedLiquityV2,
    Lv2PointsCampaign | null
> = {
    [SupportedLiquityV2.Quill]: {
        name: "Quill finance",
        description:
            "A secure, over-collateralized stablecoin protocol on Scroll's zk-Rollup network.",
        url: "https://app.quill.finance",
        protocol: SupportedLiquityV2.Quill,
        icon: QuillLogo,
        from: 1744892700,
        to: 1744899900,
        actions: {
            [Lv2PointsCampaign2Action.StabilityPool]: [],
            [Lv2PointsCampaign2Action.Debt]: [],
            [Lv2PointsCampaign2Action.Liquidity]: [],
        },
    },
    [SupportedLiquityV2.Orki]: null,
    [SupportedLiquityV2.Ebisu]: null,
    [SupportedLiquityV2.Liquity]: null,
};
