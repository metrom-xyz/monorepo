import { ProjectCard, SkeletonProjectCard } from "../project-card";
import { useProjects } from "@/src/hooks/useProjects";
import { LoadingBar } from "../loading-bar";
import { getProjectIconUrl, getProjectIllustrationUrl } from "@/src/commons";
import { useTranslations } from "next-intl";
import { EmptyIcon } from "@/src/assets/empty-icon";
import { Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import {
    getChainsForProtocol,
    getChainsForTurtleDeal,
} from "@/src/utils/protocols";
import {
    ChainType,
    SupportedTurtleDeal,
    type SupportedProtocol,
} from "@metrom-xyz/sdk";
import { useChainType } from "@/src/hooks/useChainType";
import type { ChainWithType } from "@/src/types/chain";

import styles from "./styles.module.css";

export function ProjectsList() {
    const t = useTranslations("allCampaigns.projects");

    const chainType = useChainType();
    const { loading, fetching, placeholderData, projects } = useProjects({
        chainType: chainType === ChainType.Aptos ? chainType : undefined,
        crossVm: chainType === ChainType.Evm,
    });

    return (
        <div className={styles.root}>
            <LoadingBar
                loading={placeholderData && fetching}
                className={styles.loadingBar}
            />
            <div
                className={classNames(styles.list, {
                    [styles.empty]:
                        !loading && (!projects || projects.length === 0),
                })}
            >
                {loading ? (
                    <>
                        <SkeletonProjectCard />
                        <SkeletonProjectCard />
                        <SkeletonProjectCard />
                        <SkeletonProjectCard />
                        <SkeletonProjectCard />
                    </>
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
                        const { slug, kind } = project;

                        let chains: ChainWithType[] = [];

                        if (kind === "liquidity-deals")
                            chains = getChainsForTurtleDeal(
                                slug as SupportedTurtleDeal,
                                chainType !== ChainType.Aptos,
                            );
                        else
                            chains = getChainsForProtocol(
                                slug as SupportedProtocol,
                                chainType !== ChainType.Aptos,
                            );

                        return (
                            <ProjectCard
                                key={slug}
                                href={`/projects/${slug}`}
                                totalCampaigns={project.campaigns.total}
                                activeCampaigns={project.campaigns.active}
                                name={project.name}
                                types={project.types}
                                chains={chains}
                                iconUrl={getProjectIconUrl(slug)}
                                illustrationUrl={getProjectIllustrationUrl(
                                    slug,
                                )}
                                branding={project.branding}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
