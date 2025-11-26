"use client";

import { Header } from "./header";
import { ProjectIntro } from "../protocol-intro";
import { BackendCampaignType } from "@metrom-xyz/sdk";
import { PROJECTS_METADATA } from "@/src/commons/projects";
import { ProjectKind } from "@/src/types/project";
import { PROJECTS_WIDGETS } from "@/src/commons/project-widgets";
import { Campaigns } from "../campaigns";

import styles from "./styles.module.css";

interface ProjectProps {
    project: string;
}

export function Project({ project }: ProjectProps) {
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
                <Campaigns
                    tabs={[
                        BackendCampaignType.Points,
                        BackendCampaignType.Rewards,
                    ]}
                    disableFilters
                    optionalFilters={{
                        protocols: [{ label: "", value: project }],
                    }}
                />
            )}
            {kind === ProjectKind.Chain && (
                <Campaigns
                    tabs={[
                        BackendCampaignType.Points,
                        BackendCampaignType.Rewards,
                    ]}
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
                />
            )}
            {kind === ProjectKind.LiquidityDeals && (
                <>
                    {/* TODO: enable this if we need to show TVL and status */}
                    {/* <LiquidityProviderDeal
                        protocol={details.protocol}
                        campaignId={campaignId}
                    /> */}
                    <Campaigns
                        tabs={[
                            BackendCampaignType.Points,
                            BackendCampaignType.Rewards,
                        ]}
                        disableFilters
                        optionalFilters={{
                            protocols: [{ label: "", value: project }],
                        }}
                    />
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
