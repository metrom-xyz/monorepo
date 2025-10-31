"use client";

import { ProjectOpportunitiesBanner } from "./project-opportunities-banner";
import { CampaignsTable } from "../campaigns-table";
import { Tab, Tabs } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { TokensIcon } from "@/src/assets/tokens-icon";
import { PointsIcon } from "@/src/assets/points-icon";
import { BackendCampaignType } from "@metrom-xyz/sdk";
import { useState } from "react";
import { ProjectsList } from "../projects-list";
import { useCampaignsCount } from "@/src/hooks/useCampaignsCount";
import { ProjectsIcon } from "@/src/assets/projects-icon";
import { Counter } from "./counter";

import styles from "./styles.module.css";

export type BackendCampaignTypeAndProjects = BackendCampaignType | "projects";

export function Campaigns() {
    const t = useTranslations("allCampaigns");

    const [activeTabCount, setActiveTabCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<BackendCampaignTypeAndProjects>(
        BackendCampaignType.Rewards,
    );

    const rewards = useCampaignsCount({ type: BackendCampaignType.Rewards });
    const points = useCampaignsCount({ type: BackendCampaignType.Points });
    const projects = useCampaignsCount({ type: "projects" });

    const rewardsAdjustedCount =
        type === BackendCampaignType.Rewards ? activeTabCount : rewards.count;
    const pointsAdjustedCount =
        type === BackendCampaignType.Points ? activeTabCount : points.count;

    return (
        <div className={styles.root}>
            <ProjectOpportunitiesBanner />
            <Tabs value={type} onChange={setType}>
                <Tab icon={TokensIcon} value={BackendCampaignType.Rewards}>
                    <Counter
                        label={t("tabs.tokens")}
                        loading={loading || rewards.loading}
                        count={rewardsAdjustedCount}
                    />
                </Tab>
                <Tab icon={PointsIcon} value={BackendCampaignType.Points}>
                    <Counter
                        label={t("tabs.points")}
                        loading={loading || points.loading}
                        count={pointsAdjustedCount}
                    />
                </Tab>
                <Tab icon={ProjectsIcon} value={"projects"}>
                    {t("tabs.projects")} {projects.count}
                </Tab>
            </Tabs>
            {type === "projects" ? (
                <ProjectsList />
            ) : (
                <CampaignsTable
                    type={type}
                    onCountChange={setActiveTabCount}
                    onLoadingChange={setLoading}
                />
            )}
        </div>
    );
}
