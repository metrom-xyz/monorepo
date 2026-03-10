import { Skeleton, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { CampaignStatusDot } from "../campaign-status-dot";
import { Status } from "@metrom-xyz/sdk";
import classNames from "classnames";

import styles from "./styles.module.css";

interface ProjectCampaignsTotalsProps {
    total: number;
    active: number;
    short?: boolean;
}

export function ProjectCampaignsTotals({
    total,
    active,
    short = false,
}: ProjectCampaignsTotalsProps) {
    const t = useTranslations("allCampaigns.projects");

    return (
        <div className={styles.root}>
            <div className={styles.tag}>
                <Typography size="sm" className={styles.lightText}>
                    {t.rich(short ? "campaignsShort" : "campaigns", {
                        count: total,
                        highlighted: (chunks) => (
                            <span className={styles.mainText}>{chunks}</span>
                        ),
                    })}
                </Typography>
            </div>
            <div
                className={classNames(styles.activeChip, {
                    [styles.active]: !!active,
                })}
            >
                {!!active && (
                    <CampaignStatusDot
                        status={Status.Active}
                        className={styles.statusDot}
                    />
                )}
                <Typography
                    size="sm"
                    weight="medium"
                    className={styles.activeText}
                >
                    {t("active", { count: active })}
                </Typography>
            </div>
        </div>
    );
}

export function SekeletonProjectCampaignsTotals() {
    return (
        <div className={styles.root}>
            <Skeleton width={100} size="sm" />
            <Skeleton width={90} height={20} />
        </div>
    );
}
