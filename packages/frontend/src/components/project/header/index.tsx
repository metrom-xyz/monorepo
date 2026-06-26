import { Typography } from "@metrom-xyz/ui";
import Image from "next/image";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";
import type { Project } from "@/src/types/project";
import { ProjectCampaignsTotals } from "../../project-campaigns-totals";
import { getProjectIconUrl, getProjectIllustrationUrl } from "@/src/commons";

import styles from "./styles.module.css";

interface HeaderProps {
    project: Project;
}

export function Header({ project }: HeaderProps) {
    const t = useTranslations("projectPage.header");

    const { slug, name, description, url, branding, types, campaigns } =
        project;
    const iconUrl = getProjectIconUrl(slug);
    const illustrationUrl = getProjectIllustrationUrl(slug);

    return (
        <div
            style={{
                background: `linear-gradient(45deg, ${branding.light}, ${branding.main})`,
            }}
            className={styles.root}
        >
            <Image
                src={illustrationUrl}
                alt={`${name} illustration`}
                width={308}
                height={195}
                unoptimized
                loading="eager"
                className={styles.illustration}
            />
            <div
                className={styles.projectIconWrapper}
                style={{ backgroundColor: branding.iconBackground }}
            >
                <Image
                    src={iconUrl}
                    alt={`${name} icon`}
                    width={56}
                    height={56}
                    unoptimized
                    loading="eager"
                    className={styles.projectIcon}
                />
            </div>
            <div className={styles.rightContent}>
                <div className={styles.title}>
                    <Typography
                        size="xl3"
                        weight="medium"
                        className={styles.mainText}
                    >
                        {t("title", { protocol: name })}
                    </Typography>
                    <div className={styles.rightTitle}>
                        {types.length > 0 && (
                            <div className={styles.types}>
                                {types.map((type) => (
                                    <div key={type} className={styles.type}>
                                        <Typography
                                            size="xs"
                                            weight="medium"
                                            uppercase
                                            className={styles.mainText}
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
                            <ArrowRightIcon
                                className={styles.externalLinkIcon}
                            />
                        </a>
                    </div>
                </div>
                <Typography weight="medium" className={styles.mainText}>
                    {description}
                </Typography>
                <ProjectCampaignsTotals
                    total={campaigns.total}
                    active={campaigns.active}
                />
            </div>
        </div>
    );
}
