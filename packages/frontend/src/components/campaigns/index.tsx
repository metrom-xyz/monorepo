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
import { ProjectsIcon } from "@/src/assets/projects-icon";

import styles from "./styles.module.css";

export type BackendCampaignTypeAndProjects = BackendCampaignType | "projects";

export function Campaigns() {
    const t = useTranslations("allCampaigns");

    const [type, setType] = useState<BackendCampaignTypeAndProjects>(
        BackendCampaignType.Rewards,
    );

    return (
        <div className={styles.root}>
            <ProjectOpportunitiesBanner />
            <Tabs value={type} onChange={setType}>
                <Tab icon={TokensIcon} value={BackendCampaignType.Rewards}>
                    {t("tabs.tokens")}
                </Tab>
                <Tab icon={PointsIcon} value={BackendCampaignType.Points}>
                    {t("tabs.points")}
                </Tab>
                <Tab icon={ProjectsIcon} value={"projects"}>
                    {t("tabs.projects")}
                </Tab>
            </Tabs>
            {type === "projects" ? (
                <ProjectsList />
            ) : (
                <CampaignsTable type={type} />
            )}
        </div>
    );
}
