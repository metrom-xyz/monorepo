"use client";

import { ENVIRONMENT } from "@/src/commons/env";
import { PROJECT_PAGES } from "@/src/commons/project-pages";
import { useTranslations } from "next-intl";
import { Header } from "./header";
import { Details } from "./details";
import { ProjectIntro } from "../protocol-intro";
import { useCampaigns } from "@/src/hooks/useCampaigns";
import { CampaignsTable } from "../campaigns-table";
import { Typography } from "@metrom-xyz/ui";
import { useMemo } from "react";
import { Campaign, Status } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface ProjectProps {
    project: string;
}

export function Project({ project }: ProjectProps) {
    const t = useTranslations("projectPage");

    const details = PROJECT_PAGES[ENVIRONMENT][project];

    const { loading: loadingCampaigns, campaigns } = useCampaigns({
        chainId: details.campaignsFilters.chainId,
        dex: details.campaignsFilters.dex,
        enabled: !!details,
    });

    const duration = useMemo(() => {
        if (!campaigns) return undefined;

        const liveCampaigns = campaigns.filter(
            ({ status }) => status === Status.Live,
        );
        const endedCampaigns = campaigns.filter(
            ({ status }) => status === Status.Ended,
        );

        let toSort: Campaign[] = [];
        if (liveCampaigns.length > 0) toSort = liveCampaigns;
        else toSort = endedCampaigns;

        const campaignsByFrom = toSort.sort((a, b) => b.from - a.from);
        const campaignsByTo = toSort.sort((a, b) => b.to - a.to);

        if (campaignsByFrom.length === 0 || campaignsByTo.length === 0)
            return { from: 0, to: 0 };

        return {
            from: campaignsByFrom[0].from,
            to: campaignsByTo[campaignsByTo.length - 1].to,
        };
    }, [campaigns]);

    if (!project) return null;

    const { name, description, url, brand, icon, intro } = details;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                description={description}
                url={url}
                brand={brand}
                icon={icon}
            />
            <Details from={duration?.from} to={duration?.to} />
            {intro && (
                <ProjectIntro project={project} brand={brand} {...intro} />
            )}
            <div className={styles.opportunities}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("explore")}
                </Typography>
                <CampaignsTable
                    campaigns={campaigns}
                    loading={loadingCampaigns}
                    disableFilters
                />
            </div>
        </div>
    );
}
