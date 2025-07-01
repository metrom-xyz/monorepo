"use client";

import { useRouter } from "@/src/i18n/routing";
import { CampaignType } from "@/src/types/campaign";
import {
    type DexProtocol,
    type LiquityV2Protocol,
    ProtocolType,
} from "@metrom-xyz/chains";
import { useEffect } from "react";
import { SkeletonForm } from "./skeleton-form";

interface RedirectProps {
    [ProtocolType.Dex]: readonly DexProtocol[];
    [ProtocolType.LiquityV2]: readonly LiquityV2Protocol[];
}

export function Redirect(props: RedirectProps) {
    const router = useRouter();

    useEffect(() => {
        if (props[ProtocolType.Dex].length === 0)
            router.replace(`/campaigns/create/${CampaignType.LiquityV2}`);

        if (props[ProtocolType.LiquityV2].length === 0)
            router.replace(
                `/campaigns/create/${CampaignType.AmmPoolLiquidity}`,
            );
    }, [router, props]);

    return <SkeletonForm />;
}
