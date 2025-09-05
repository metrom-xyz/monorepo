"use client";

import { Details } from "./details";
import { Header } from "./header";
import { Leaderboard } from "../leaderboard";
import { ChainType, type SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "@/src/commons/env";
import { useLv2PointsCampaignLeaderboard } from "@/src/hooks/useLv2PointsCampaignLeaderboard";
import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";
import { Actions } from "./actions";
import { ProjectIntro } from "../protocol-intro";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface Lv2PointsCampaignProps {
    protocol: SupportedLiquityV2;
}

export function Lv2PointsCampaign({ protocol }: Lv2PointsCampaignProps) {
    const t = useTranslations("lv2PointsCampaignPage");

    const { loading: loadingLeaderboard, leaderboard } =
        useLv2PointsCampaignLeaderboard({ protocol });

    const campaign = LV2_POINTS_CAMPAIGNS[ENVIRONMENT][protocol];

    if (!campaign) return null;

    const {
        name,
        description,
        pointsName,
        brand,
        url,
        chain,
        icon,
        protocolIntro,
        from,
        to,
        leaderboard: showLeaderboard,
        actions,
    } = campaign;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                description={description}
                url={url}
                brand={brand}
                icon={icon}
            />
            <Details from={from} to={to} protocol={name} />
            {protocolIntro && (
                <ProjectIntro
                    project={protocol}
                    brand={brand}
                    {...protocolIntro}
                />
            )}
            <Actions
                chain={chain.id}
                protocol={protocol}
                actions={actions}
                pointsName={pointsName}
            />
            {showLeaderboard && (
                <Leaderboard
                    noDistributionDate
                    chainId={chain.id}
                    chainType={chain.type}
                    loading={loadingLeaderboard}
                    leaderboard={leaderboard}
                    messages={{
                        personalRank: {
                            noRewards: t("noPoints", { points: pointsName }),
                        },
                        repartionChart: {
                            title: t("distribution"),
                        },
                    }}
                />
            )}
        </div>
    );
}
