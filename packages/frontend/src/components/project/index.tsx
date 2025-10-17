"use client";

import { ENVIRONMENT } from "@/src/commons/env";
import { PROJECT_PAGES } from "@/src/commons/project-pages";
import { useTranslations } from "next-intl";
import { Header } from "./header";
import { ProjectIntro } from "../protocol-intro";
import { CampaignsTable } from "../campaigns-table";
import { Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface ProjectProps {
    project: string;
}

export function Project({ project }: ProjectProps) {
    const t = useTranslations("projectPage");

    const details = PROJECT_PAGES[ENVIRONMENT][project];

    if (!project) return null;

    const {
        name,
        description,
        url,
        brand,
        icon,
        intro,
        chain,
        campaignsFilters,
    } = details;

    return (
        <div className={styles.root}>
            <Header
                name={name}
                description={description}
                url={url}
                brand={brand}
                icon={icon}
            />
            {intro && (
                <ProjectIntro project={project} brand={brand} {...intro} />
            )}
            <div className={styles.opportunities}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("explore")}
                </Typography>
                <CampaignsTable
                    disableFilters
                    optionalFilters={{
                        chainId: campaignsFilters.chainId?.toString(),
                        chainType: chain.type,
                        protocol: campaignsFilters.dex,
                    }}
                />
            </div>
        </div>
    );
}
