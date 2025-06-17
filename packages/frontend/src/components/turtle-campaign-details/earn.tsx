"use client";

import { TURTLE_REFERRAL_CODE } from "@/src/commons/turtle-campaigns";
import { useAppKit } from "@reown/appkit/react";
import { EarnPage, useWagmiAdapter } from "@turtledev/react";

interface EarnProps {
    campaignId: string;
    address?: string;
}

export function Earn({ campaignId, address }: EarnProps) {
    const { open } = useAppKit();
    const adapter = useWagmiAdapter();

    return (
        <EarnPage
            referral={TURTLE_REFERRAL_CODE}
            campaignId={campaignId}
            user={address}
            openConnectionModal={open}
            {...adapter}
        />
    );
}
