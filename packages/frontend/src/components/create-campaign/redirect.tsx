"use client";

import { useRouter } from "@/src/i18n/routing";
import { CampaignType } from "@/src/types/campaign";
import {
    type AaveV3Protocol,
    type DexProtocol,
    type LiquityV2Protocol,
    type ProtocolBase,
    ProtocolType,
} from "@metrom-xyz/chains";
import { useEffect } from "react";
import { SkeletonForm } from "./skeleton-form";

const PROTOCOL_TO_CAMPAIGN_TYPE: Record<ProtocolType, CampaignType> = {
    [ProtocolType.Dex]: CampaignType.AmmPoolLiquidity,
    [ProtocolType.LiquityV2]: CampaignType.LiquityV2,
    [ProtocolType.AaveV3]: CampaignType.AaveV3,
};

interface RedirectProps {
    [ProtocolType.Dex]: readonly DexProtocol[];
    [ProtocolType.LiquityV2]: readonly LiquityV2Protocol[];
    [ProtocolType.AaveV3]: readonly AaveV3Protocol[];
}

export function Redirect(props: RedirectProps) {
    const router = useRouter();

    useEffect(() => {
        const configured: ProtocolBase[] = Object.values(props)
            .filter((protocols) => protocols.length > 0)
            .flat();

        if (configured.length === 1)
            router.replace(
                `/campaigns/create/${PROTOCOL_TO_CAMPAIGN_TYPE[configured[0].type]}`,
            );
    }, [router, props]);

    return <SkeletonForm />;
}
