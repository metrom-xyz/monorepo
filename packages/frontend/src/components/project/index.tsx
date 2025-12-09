"use client";

import { Header } from "./header";
import { Intro } from "./intro";
import { BackendCampaignType, ChainType } from "@metrom-xyz/sdk";
import { PROJECTS_METADATA } from "@/src/commons/projects";
import { ProjectKind } from "@/src/types/project";
import { PROJECTS_WIDGETS } from "@/src/commons/project-widgets";
import { Campaigns, type BackendCampaignTypeAndProjects } from "../campaigns";
import { useMemo } from "react";
import type { FilterParams, RawFilters } from "../campaigns-table/filters";
import { useCampaignsCount } from "@/src/hooks/useCampaignsCount";
import { APTOS } from "@/src/commons/env";

import styles from "./styles.module.css";

interface ProjectProps {
    project: string;
}

export function Project({ project }: ProjectProps) {
    const details = PROJECTS_METADATA[project];

    const {
        name,
        kind,
        protocol,
        description,
        url,
        branding,
        icon,
        illustration,
        intro,
    } = details;

    const Widget = PROJECTS_WIDGETS[project];

    const optionalFilters: RawFilters = useMemo(() => {
        switch (kind) {
            case ProjectKind.GenericProtocol:
            case ProjectKind.PointsTracking:
            case ProjectKind.LiquidityDeals:
                return {
                    chains: [],
                    statuses: [],
                    protocols: [{ label: "", value: protocol }],
                };
            case ProjectKind.Chain:
                return {
                    chains: [
                        {
                            label: "",
                            query: "",
                            value: `${details.chainType}_${details.chainId}`,
                        },
                    ],
                    statuses: [],
                    protocols: [],
                };
            default:
                return { chains: [], statuses: [], protocols: [] };
        }
    }, [details, kind, protocol]);

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
            <Header
                name={name}
                slug={project}
                url={url}
                description={description}
                branding={branding}
                icon={icon}
                illustration={illustration}
            />
            {intro && <Intro {...intro} />}
            {Widget && (
                <div className={styles.widgets}>
                    <Widget />
                </div>
            )}
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
