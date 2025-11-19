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

const PAGE_SIZE = 10;

export function ProjectsList() {
    const t = useTranslations("allCampaigns.projects");

    const { loading, fetching, placeholderData, projects } = useProjects({
        page: 1,
        pageSize: PAGE_SIZE,
    });

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
                        const { name } = project;

                        const metadata = PROJECTS_METADATA[name];
                        const href =
                            metadata.kind === ProjectKind.LiquidityDeals
                                ? `/projects/${name}_${metadata.campaignId}`
                                : `/projects/${name}`;

                        return (
                            <ProjectCard
                                key={name}
                                href={href}
                                {...project}
                                name={metadata.name}
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
