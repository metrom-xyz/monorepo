"use client";

import { Header } from "./header";
import { Intro } from "./intro";
import {
    BackendCampaignType,
    SupportedLiquidityProviderDeal,
} from "@metrom-xyz/sdk";
import type { Project } from "@/src/types/project";
import { PROJECTS_WIDGETS } from "@/src/commons/project-widgets";
import { Campaigns } from "../campaigns";
import { useMemo } from "react";
import type { RawFilters } from "../campaigns-table/filters";
import { getChainDataBySlug } from "@/src/utils/chain";
import { BackButton } from "../back-button";

import styles from "./styles.module.css";

interface ProjectProps {
    project: Project;
}

export function Project({ project }: ProjectProps) {
    const { slug, kind } = project;

    const Widget = PROJECTS_WIDGETS[slug];

    const optionalFilters: RawFilters = useMemo(() => {
        switch (kind) {
            case "generic-protocol":
            case "points-tracking":
            case "partner":
                return {
                    chains: [],
                    statuses: [],
                    protocols: [{ label: "", value: slug }],
                };
            case "liquidity-deals": {
                const [, chain] = slug.split("-");
                const chainData = getChainDataBySlug(chain);

                if (!chainData) {
                    console.warn(
                        `Unsupported liquidity deals project with chain ${chain}`,
                    );
                    return { chains: [], statuses: [], protocols: [] };
                }

                return {
                    chains: [
                        {
                            label: "",
                            query: "",
                            value: `${chainData.type}_${chainData.id}`,
                        },
                    ],
                    statuses: [],
                    protocols: [
                        {
                            label: "",
                            value: SupportedLiquidityProviderDeal.Turtle,
                        },
                    ],
                };
            }
            case "chain":
                if (
                    project.chainType === undefined ||
                    project.chainId === undefined
                )
                    return { chains: [], statuses: [], protocols: [] };
                return {
                    chains: [
                        {
                            label: "",
                            query: "",
                            value: `${project.chainType}_${project.chainId}`,
                        },
                    ],
                    statuses: [],
                    protocols: [],
                };
            default:
                return { chains: [], statuses: [], protocols: [] };
        }
    }, [project, slug, kind]);

    return (
        <div className={styles.root}>
            <div className={styles.topContent}>
                <BackButton />
                <Header project={project} />
                {project.intro && <Intro {...project.intro} />}
                {Widget && (
                    <div className={styles.widgets}>
                        <Widget />
                    </div>
                )}
            </div>
            <Campaigns
                tabs={[BackendCampaignType.Rewards, BackendCampaignType.Points]}
                disableFilters
                hideHeader
                optionalFilters={optionalFilters}
            />
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
