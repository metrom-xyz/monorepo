import type { CampaignAmmPool, Specification } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { WEIGHT_UNIT } from "@/src/commons";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import { CampaignTag } from "../campaign-tag";

import styles from "./styles.module.css";

interface CampaignWeightingProps {
    specification?: Specification;
    pool?: CampaignAmmPool;
}

export function CampaignWeighting({
    specification,
    pool,
}: CampaignWeightingProps) {
    const t = useTranslations("campaignWeighting");

    if (!specification || !specification.weighting || !pool) return null;

    const { token0, token1, liquidity } = specification.weighting;
    const token0Weight = (token0 / WEIGHT_UNIT) * 100;
    const token1Weight = (token1 / WEIGHT_UNIT) * 100;
    const liquidityWeight = (liquidity / WEIGHT_UNIT) * 100;

    return (
        <CampaignTag
            variant="secondary"
            text={
                <div className={styles.root}>
                    <Typography size="sm" variant="tertiary">
                        {t("rewardsRatio")}
                    </Typography>
                    <div className={styles.labels}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                        >
                            {t.rich("token0", {
                                symbol: pool.tokens[0].symbol,
                                value: formatPercentage({
                                    percentage: token0Weight,
                                }),
                                highlighted: (chunks) => (
                                    <span className={styles.higlightedText}>
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </Typography>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                        >
                            {t.rich("token1", {
                                symbol: pool.tokens[1].symbol,
                                value: formatPercentage({
                                    percentage: token1Weight,
                                }),
                                highlighted: (chunks) => (
                                    <span className={styles.higlightedText}>
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </Typography>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                        >
                            {t.rich("fees", {
                                value: formatPercentage({
                                    percentage: liquidityWeight,
                                }),
                                highlighted: (chunks) => (
                                    <span className={styles.higlightedText}>
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </Typography>
                    </div>
                </div>
            }
        />
    );
}
