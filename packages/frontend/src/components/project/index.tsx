"use client";

import { Header } from "./header";
import { Intro } from "./intro";
import {
    BackendCampaignType,
    ChainType,
    SupportedLiquidityProviderDeal,
    type Project as ProjectType,
} from "@metrom-xyz/sdk";
import { PROJECTS_WIDGETS } from "@/src/commons/project-widgets";
import { Campaigns, type BackendCampaignTypeAndProjects } from "../campaigns";
import { useMemo } from "react";
import type { FilterParams, RawFilters } from "../campaigns-table/filters";
import { useCampaignsCount } from "@/src/hooks/useCampaignsCount";
import { APTOS } from "@/src/commons/env";
import { getChainDataBySlug } from "@/src/utils/chain";
import { BackButton } from "../back-button";

import styles from "./styles.module.css";

interface ProjectProps {
    project: ProjectType;
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

    const { chainTypes, chainIds, protocols }: FilterParams = useMemo(() => {
        const { chains, statuses, protocols } = optionalFilters;

        const chainTypes: ChainType[] = [];
        const chainIds: string[] = [];
        chains.forEach((chain) => {
            const [chainType, chainId] = chain.value.split("_");
            if (!chainTypes.includes(chainType as ChainType))
                chainTypes.push(chainType as ChainType);
            if (!chainIds.includes(chainId)) chainIds.push(chainId);
        });

        return {
            chainIds: chainIds.map(Number),
            protocols: protocols.map(({ value }) => value),
            statuses: statuses.map(({ value }) => value),
            chainTypes: APTOS
                ? [ChainType.Aptos]
                : chainTypes
                  ? chainTypes
                  : undefined,
        };
    }, [optionalFilters]);

    const { loading, points, rewards } = useCampaignsCount({
        chainTypes,
        chainIds,
        protocols,
    });

    const tabs = useMemo(() => {
        if (loading || points === undefined || rewards === undefined) return [];

        const activeTabs: BackendCampaignTypeAndProjects[] = [];
        if (points > 0) activeTabs.push(BackendCampaignType.Points);
        if (rewards > 0) activeTabs.push(BackendCampaignType.Rewards);

        return activeTabs;
    }, [loading, points, rewards]);

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
                tabs={tabs}
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
