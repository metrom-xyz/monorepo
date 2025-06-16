"use client";

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
            // TODO: add referral code
            referral="YOUR_REFERRAL_CODE"
            campaignId={campaignId}
            user={address}
            openConnectionModal={open}
            {...adapter}
        />
    );
}
