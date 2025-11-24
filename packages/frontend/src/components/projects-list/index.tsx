import { ProjectCard } from "../project-card";
import { useProjects } from "@/src/hooks/useProjects";
import { LoadingBar } from "../loading-bar";
import { PROJECTS_METADATA } from "@/src/commons/projects";
import { useTranslations } from "next-intl";
import { EmptyIcon } from "@/src/assets/empty-icon";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { ProjectKind } from "@/src/types/project";

import styles from "./styles.module.css";

export function ProjectsList() {
    const t = useTranslations("allCampaigns.projects");

    const { loading, fetching, placeholderData, projects } = useProjects();

    return (
        <div className={styles.root}>
            <LoadingBar
                loading={placeholderData && fetching}
                className={styles.loadingBar}
            />
            <div
                className={classNames(styles.list, {
                    [styles.empty]: !projects || projects.length === 0,
                })}
            >
                {loading ? (
                    // TODO: add loading once we fetch from API
                    <div></div>
                ) : !projects || projects.length === 0 ? (
                    <div className={styles.empty}>
                        <EmptyIcon />
                        <div className={styles.textWrapper}>
                            <Typography uppercase weight="medium" size="sm">
                                {t("empty.title")}
                            </Typography>
                            <Typography size="sm" variant="tertiary">
                                {t("empty.description")}
                            </Typography>
                        </div>
                    </div>
                ) : (
                    projects.map((project) => {
                        const { slug } = project;

                        const metadata = PROJECTS_METADATA[slug];
                        if (!metadata) return null;

                        const href =
                            metadata.kind === ProjectKind.LiquidityDeals
                                ? `/projects/${slug}_${metadata.campaignId}`
                                : `/projects/${slug}`;

                        return (
                            <ProjectCard
                                key={slug}
                                href={href}
                                {...project}
                                totalCampaigns={project.campaigns.total}
                                activeCampaigns={project.campaigns.active}
                                name={metadata.name}
                                types={metadata.types}
                                chains={metadata.chains}
                                icon={metadata.icon}
                                illustration={metadata.illustration}
                                branding={metadata.branding}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
