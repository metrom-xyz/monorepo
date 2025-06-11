import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { useIsAccountOnLiquidityLand } from "@/src/hooks/useIsAccountOnLiquidityLand";
import classNames from "classnames";
import { LIQUIDITY_LAND_REFERRAL_URL } from "@/src/commons";

import styles from "./styles.module.css";

interface LiquidityLandChipProps {
    endpoint?: string;
    boost?: number;
}

export function LiquidityLandChip({ boost, endpoint }: LiquidityLandChipProps) {
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
                href={LIQUIDITY_LAND_REFERRAL_URL}
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
