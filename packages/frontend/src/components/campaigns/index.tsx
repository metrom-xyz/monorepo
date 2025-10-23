"use client";

import { ProjectOpportunitiesBanner } from "./project-opportunities-banner";
import { CampaignsTable } from "../campaigns-table";
import { useState } from "react";
import { BackendCampaignType } from "@metrom-xyz/sdk";
import { Tab, Tabs } from "@metrom-xyz/ui";
import { TokensIcon } from "@/src/assets/tokens-icon";
import { PointsIcon } from "@/src/assets/points-icon";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function Campaigns() {
    const t = useTranslations("allCampaigns");

    const [type, setType] = useState<BackendCampaignType>(
        BackendCampaignType.Rewards,
    );

    return (
        <div className={styles.root}>
            <ProjectOpportunitiesBanner />
            <Tabs size="xl" value={type} onChange={setType}>
                <Tab icon={TokensIcon} value={BackendCampaignType.Rewards}>
                    {t("tabs.tokens")}
                </Tab>
                <Tab icon={PointsIcon} value={BackendCampaignType.Points}>
                    {t("tabs.points")}
                </Tab>
            </Tabs>
            <CampaignsTable type={type} />
        </div>
    );
}
