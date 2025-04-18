"use client";

import { Details } from "./details";
import { Header } from "./header";
import { Leaderboard } from "../leaderboard";
import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "@/src/commons/env";
import { useLv2PointsCampaignLeaderboard } from "@/src/hooks/useLv2PointsCampaignLeaderboard";
import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";

import styles from "./styles.module.css";

interface Lv2PointsCampaignProps {
    protocol: SupportedLiquityV2;
}

export function Lv2PointsCampaign({ protocol }: Lv2PointsCampaignProps) {
    const { loading: loadingLeaderboard, leaderboard } =
        useLv2PointsCampaignLeaderboard({ protocol });

    const campaign = LV2_POINTS_CAMPAIGNS[ENVIRONMENT][protocol];

    if (!campaign) return null;

    const { name, description, url, icon, from, to } = campaign;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                description={description}
                url={url}
                icon={icon}
            />
            <Details from={from} to={to} protocol={name} />
            <Leaderboard
                noDistributionDate
                loading={loadingLeaderboard}
                leaderboard={leaderboard}
            />
        </div>
    );
}
