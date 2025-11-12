"use client";

import { Header } from "./header";
import { ProjectIntro } from "../protocol-intro";
import { CampaignsTable } from "../campaigns-table";
import { BackendCampaignType } from "@metrom-xyz/sdk";
import { PROJECTS_METADATA } from "@/src/commons/projects";
import { ProjectKind } from "@/src/types/project";
import { Tab, Tabs } from "@metrom-xyz/ui";
import { PointsIcon } from "@/src/assets/points-icon";
import { useTranslations } from "next-intl";
import { TokensIcon } from "@/src/assets/tokens-icon";

import styles from "./styles.module.css";

interface ProjectProps {
    project: string;
}

export function Project({ project }: ProjectProps) {
    const t = useTranslations("projectPage");

    const details = PROJECTS_METADATA[project];

    if (!project) return null;

    const {
        name,
        kind,
        description,
        url,
        branding,
        icon,
        illustration,
        intro,
    } = details;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                url={url}
                description={description}
                branding={branding}
                icon={icon}
                illustration={illustration}
            />
            {intro && <ProjectIntro {...intro} />}
            {kind === ProjectKind.PointsTracking && (
                <div className={styles.tableWrapper}>
                    <Tabs
                        value={BackendCampaignType.Points}
                        onChange={() => {}}
                    >
                        <Tab
                            icon={PointsIcon}
                            value={BackendCampaignType.Points}
                        >
                            {t("points")}
                        </Tab>
                    </Tabs>
                    <CampaignsTable
                        type={BackendCampaignType.Points}
                        disableFilters
                        optionalFilters={{
                            protocols: [{ label: "", value: project }],
                        }}
                        className={styles.table}
                    />
                </div>
            )}
            {kind === ProjectKind.Chain && (
                <div className={styles.tableWrapper}>
                    <Tabs
                        value={BackendCampaignType.Rewards}
                        onChange={() => {}}
                    >
                        <Tab
                            icon={TokensIcon}
                            value={BackendCampaignType.Rewards}
                        >
                            {t("tokens")}
                        </Tab>
                    </Tabs>
                    <CampaignsTable
                        type={BackendCampaignType.Rewards}
                        disableFilters
                        optionalFilters={{
                            chains: [
                                {
                                    label: "",
                                    query: "",
                                    value: `${details.chainType}_${details.chainId}`,
                                },
                            ],
                        }}
                        className={styles.table}
                    />
                </div>
            )}
        </div>
    );
}

export function SkeletonProject() {
    return (
        <div className={styles.root}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonProjectIntro}>
                <div className={styles.skeletonIntroArticle}></div>
                <div className={styles.skeletonIntroArticle}></div>
            </div>
        </div>
    );
}
