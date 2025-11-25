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
import { LiquidityProviderDeal } from "./liquidity-provider-deal";
import { PROJECTS_WIDGETS } from "@/src/commons/project-widgets";

import styles from "./styles.module.css";

interface ProjectProps {
    project: string;
    campaignId?: string;
}

export function Project({ project, campaignId }: ProjectProps) {
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

    const Widget = PROJECTS_WIDGETS[project];

    return (
        <div className={styles.root}>
            <Header
                name={name}
                slug={project}
                url={url}
                description={description}
                branding={branding}
                icon={icon}
                illustration={illustration}
            />
            {intro && <ProjectIntro {...intro} />}
            {Widget && (
                <div className={styles.widgets}>
                    <Widget />
                </div>
            )}
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
            {kind === ProjectKind.LiquidityDeals && (
                <>
                    <LiquidityProviderDeal
                        protocol={details.protocol}
                        campaignId={campaignId}
                    />
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
                                protocols: [{ label: "", value: project }],
                            }}
                            className={styles.table}
                        />
                    </div>
                </>
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
