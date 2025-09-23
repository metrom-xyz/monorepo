"use client";

import { useRouter } from "@/src/i18n/routing";
import {
    PartnerActionType,
    ProtocolType,
    type AaveV3Protocol,
    type DexProtocol,
    type LiquityV2Protocol,
    type PartnerAction,
} from "@metrom-xyz/chains";
import { useEffect } from "react";
import { SkeletonForm } from "./skeleton-form";
import { CampaignType } from "@/src/types/campaign";

interface RedirectProps {
    supported: (
        | DexProtocol
        | LiquityV2Protocol
        | AaveV3Protocol
        | PartnerAction
    )[];
}

const PROTOCOL_TO_CAMPAIGN_TYPE: Record<
    ProtocolType | PartnerActionType,
    CampaignType
> = {
    [ProtocolType.Dex]: CampaignType.AmmPoolLiquidity,
    [ProtocolType.LiquityV2]: CampaignType.LiquityV2,
    [ProtocolType.AaveV3]: CampaignType.AaveV3,
    [PartnerActionType.AaveV3BridgeAndSupply]:
        CampaignType.AaveV3BridgeAndSupply,
    [PartnerActionType.JumperWhitelistedAmmPoolLiquidity]:
        CampaignType.JumperWhitelistedAmmPoolLiquidity,
};

export function Redirect({ supported }: RedirectProps) {
    const router = useRouter();

    useEffect(() => {
        if (supported.length > 1) return;
        router.replace(
            `/campaigns/create/${PROTOCOL_TO_CAMPAIGN_TYPE[supported[0].type]}`,
        );
    }, [router, supported]);

    return <SkeletonForm />;
}
