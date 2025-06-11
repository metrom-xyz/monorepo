import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { useIsAccountOnLiquidityLand } from "@/src/hooks/useIsAccountOnLiquidityLand";
import classNames from "classnames";

import styles from "./styles.module.css";

interface LiquidityLandChipProps {
    endpoint?: string;
    referral?: string;
    boost?: number;
}

export function LiquidityLandChip({
    boost,
    endpoint,
    referral,
}: LiquidityLandChipProps) {
    const t = useTranslations("lv2PointsCampaignPage.actions");

    const { active, loading } = useIsAccountOnLiquidityLand({
        endpoint,
        // TODO: enable once we have the BE API
        enabled: false,
    });

    if (!boost) return null;

    return (
        <div className={styles.root}>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href={referral}
                className={classNames(styles.chip, {
                    [styles.loading]: loading,
                })}
            >
                <Typography uppercase size="xs" weight="medium">
                    {t(active ? "boostActive" : "getBoost", {
                        boost: formatPercentage({
                            percentage: boost * 100,
                        }),
                    })}
                </Typography>
            </a>
        </div>
    );
}
