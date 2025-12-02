import type { SVGIcon } from "@/src/types/common";
import type { FunctionComponent } from "react";
import { Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";
import type { Branding } from "@/src/types/project";
import { useProject } from "@/src/hooks/useProject";
import { PROJECTS_METADATA } from "@/src/commons/projects";
import {
    ProjectCampaignsTotals,
    SekeletonProjectCampaignsTotals,
} from "../../project-campaigns-totals";

import styles from "./styles.module.css";

interface HeaderProps {
    name: string;
    slug: string;
    description: string;
    branding: Branding;
    url: string;
    icon: FunctionComponent<SVGIcon>;
    illustration?: FunctionComponent<SVGIcon>;
}

export function Header({
    name,
    slug,
    description,
    branding,
    url,
    icon: Icon,
    illustration: Illustration,
}: HeaderProps) {
    const t = useTranslations("projectPage.header");

    const { project, loading } = useProject({ slug });

    const metadata = PROJECTS_METADATA[slug];
    if (!metadata) return null;

    return (
        <div
            style={{
                background: `linear-gradient(to left, ${branding.main}, ${branding.light})`,
            }}
            className={styles.root}
        >
            {!!Illustration && <Illustration className={styles.illustration} />}
            <div
                className={styles.projectIconWrapper}
                style={{ backgroundColor: branding.iconBackground }}
            >
                <Icon
                    style={{ color: metadata.branding.main }}
                    className={styles.projectIcon}
                />
            </div>
            <div className={styles.rightContent}>
                <div className={styles.title}>
                    <Typography
                        size="xl2"
                        weight="semibold"
                        className={styles.mainText}
                    >
                        {t("title", { protocol: name })}
                    </Typography>
                    {metadata.types.length > 0 && (
                        <div className={styles.types}>
                            {metadata.types.map((type) => (
                                <div key={type} className={styles.type}>
                                    <Typography
                                        size="xs"
                                        weight="medium"
                                        uppercase
                                        className={styles.activeText}
                                    >
                                        {type}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    )}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.externalLink}
                    >
                        <Typography
                            size="xs"
                            weight="medium"
                            className={styles.mainText}
                        >
                            {t("visitWebsite")}
                        </Typography>
                        <ArrowRightIcon className={styles.externalLinkIcon} />
                    </a>
                </div>
                <Typography
                    weight="medium"
                    size="sm"
                    className={styles.mainText}
                >
                    {description}
                </Typography>
                {loading || !project ? (
                    <SekeletonProjectCampaignsTotals />
                ) : (
                    <ProjectCampaignsTotals
                        total={project.campaigns.total}
                        active={project.campaigns.active}
                    />
                )}
            </div>
        </div>
    );
}
