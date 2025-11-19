import type { SVGIcon } from "@/src/types/common";
import type { FunctionComponent } from "react";
import { Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";
import type { Branding } from "@/src/types/project";

import styles from "./styles.module.css";

interface HeaderProps {
    name: string;
    description: string;
    branding: Branding;
    url: string;
    icon: FunctionComponent<SVGIcon>;
    illustration?: FunctionComponent<SVGIcon>;
}

export function Header({
    name,
    description,
    branding,
    url,
    icon: Icon,
    illustration: Illustration,
}: HeaderProps) {
    const t = useTranslations("projectPage.header");

    // const { project, loading } = useProject({ name });

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
                <Icon className={styles.projectIcon} />
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
                    {/* TODO: add back once we fetch from API */}
                    {/* <div className={styles.types}>
                        {loading || !project ? (
                            <div
                                className={classNames(
                                    styles.type,
                                    styles.loading,
                                )}
                            />
                        ) : (
                            project.types.map((type) => (
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
                            ))
                        )}
                    </div> */}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.externalLink}
                    >
                        <Typography
                            size="xs"
                            weight="semibold"
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
                {/* {loading || !project ? (
                    <SekeletonProjectCampaignsTotals />
                ) : (
                    <ProjectCampaignsTotals
                        total={project.totalCampaigns}
                        active={project.activeCampaigns}
                    />
                )} */}
            </div>
        </div>
    );
}
