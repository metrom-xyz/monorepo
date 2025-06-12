import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { useIsAccountOnLiquidityLand } from "@/src/hooks/useIsAccountOnLiquidityLand";
import classNames from "classnames";
import { LIQUIDITY_LAND_REFERRAL_URL } from "@/src/commons";
import type { SupportedLiquityV2 } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface LiquidityLandChipProps {
    protocol: SupportedLiquityV2;
    boost?: number;
}

export function LiquidityLandChip({ boost, protocol }: LiquidityLandChipProps) {
    const t = useTranslations("lv2PointsCampaignPage.actions");

    const { active, loading } = useIsAccountOnLiquidityLand({ protocol });

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
