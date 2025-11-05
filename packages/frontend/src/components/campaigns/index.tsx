"use client";

import { ProjectOpportunitiesBanner } from "./project-opportunities-banner";
import { CampaignsTable } from "../campaigns-table";
import { Tab, Tabs } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { TokensIcon } from "@/src/assets/tokens-icon";
import { PointsIcon } from "@/src/assets/points-icon";
import { BackendCampaignType } from "@metrom-xyz/sdk";
import { useCallback, useEffect, useState } from "react";
import { ProjectsList } from "../projects-list";
import { ProjectsIcon } from "@/src/assets/projects-icon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SkeletonCampaigns } from "./skeleton-campaigns";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

export type BackendCampaignTypeAndProjects = BackendCampaignType | "projects";

export const URL_ENABLED_CAMPAIGNS_FILTERS = [
    "chains",
    "statuses",
    "protocols",
];

export function Campaigns() {
    const t = useTranslations("allCampaigns");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [type, setType] = useState<BackendCampaignTypeAndProjects>();

    const prevType = usePrevious(type);

    const handleClearUrlFilterParams = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        URL_ENABLED_CAMPAIGNS_FILTERS.forEach((filter) => {
            params.delete(filter);
        });

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }, [pathname, router, searchParams]);

    // This hooks initializes the type state with the values coming from the url param, or
    // if it's missing it defaults to rewards and adds that to the url.
    useEffect(() => {
        if (type) return;

        const params = new URLSearchParams(searchParams.toString());
        const urlType = params.get("type");

        if (
            urlType &&
            urlType !== BackendCampaignType.Points &&
            urlType !== BackendCampaignType.Rewards &&
            urlType !== "projects"
        ) {
            setType(BackendCampaignType.Rewards);
            return;
        }

        if (urlType) {
            setType(urlType as BackendCampaignTypeAndProjects);
            return;
        }

        params.set("type", BackendCampaignType.Rewards);
        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
        setType(BackendCampaignType.Rewards);
    }, [pathname, router, searchParams, type]);

    useEffect(() => {
        if (!type) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("type", type);

        if (prevType && prevType !== type) {
            URL_ENABLED_CAMPAIGNS_FILTERS.forEach((filter) => {
                params.delete(filter);
            });
        }

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }, [pathname, router, searchParams, type, prevType]);

    if (!type) return <SkeletonCampaigns type={BackendCampaignType.Rewards} />;

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
                <CampaignsTable
                    type={type}
                    onClearFilters={handleClearUrlFilterParams}
                />
            )}
        </div>
    );
}
