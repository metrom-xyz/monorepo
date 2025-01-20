"use client";

import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import { Link } from "@/src/i18n/routing";

import styles from "./styles.module.css";

const CAMPAIGN_TYPES = [
    {
        path: `/campaigns/create/${TargetType.AmmPoolLiquidity}`,
        label: "amm",
        icon: "",
    },
    {
        path: `/campaigns/create/${TargetType.LiquityV2Debt}`,
        label: "liquidityV2",
        icon: "",
    },
];

export function PickCampaignType() {
    return (
        <div className={styles.root}>
            {CAMPAIGN_TYPES.map(({ path, label }) => (
                <Link key={path} href={path}>
                    <div>
                        <Typography>{label}</Typography>
                    </div>
                </Link>
            ))}
        </div>
    );
}
