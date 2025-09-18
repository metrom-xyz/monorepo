"use client";

import { Details } from "./details";
import { Header } from "./header";
import { Leaderboard } from "../leaderboard";
import { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import {
    ENSO_FINANCE_API_KEY,
    ENSO_FINANCE_WIDGET,
    ENVIRONMENT,
} from "@/src/commons/env";
import { useLv2PointsCampaignLeaderboard } from "@/src/hooks/useLv2PointsCampaignLeaderboard";
import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";
import { Actions } from "./actions";
import { ProjectIntro } from "../protocol-intro";
import { useTranslations } from "next-intl";
import { Widget } from "@metrom-xyz/enso-shortcuts-widget";
import { useAppKit } from "@reown/appkit/react";

import styles from "./styles.module.css";

interface Lv2PointsCampaignProps {
    protocol: SupportedLiquityV2;
}

export function Lv2PointsCampaign({ protocol }: Lv2PointsCampaignProps) {
    const t = useTranslations("lv2PointsCampaignPage");

    const { open } = useAppKit();
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

    async function handleOnConnect() {
        await open();
    }

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
            {ENSO_FINANCE_WIDGET && protocol === SupportedLiquityV2.Ebisu && (
                <Widget
                    apiKey={ENSO_FINANCE_API_KEY}
                    tokenIn="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                    chainId={1}
                    tokenOut="0x2b4b2a06c0fdebd8de1545abdffa64ec26416796"
                    outChainId={1}
                    onConnectWallet={handleOnConnect}
                />
            )}
            {protocolIntro && (
                <ProjectIntro
                    project={protocol}
                    brand={brand}
                    {...protocolIntro}
                />
            )}
            <Actions
                chain={chain}
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
