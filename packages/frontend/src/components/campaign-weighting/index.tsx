import type { CampaignAmmPool, Specification } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { WEIGHT_UNIT } from "@/src/commons";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";

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
        <div className={styles.root}>
            <div className={styles.bar}>
                <div
                    style={{ height: `${token0Weight}%` }}
                    className={styles.section}
                ></div>
                <div
                    style={{ height: `${token1Weight}%` }}
                    className={styles.section}
                ></div>
                <div
                    style={{ height: `${liquidityWeight}%` }}
                    className={styles.section}
                ></div>
            </div>
            <div className={styles.labelsWrapper}>
                <div className={styles.labels}>
                    <Typography size="sm" weight="medium">
                        {formatPercentage({ percentage: token0Weight })}
                    </Typography>
                    <Typography size="sm" weight="medium">
                        {formatPercentage({ percentage: token1Weight })}
                    </Typography>
                    <Typography size="sm" weight="medium">
                        {formatPercentage({ percentage: liquidityWeight })}
                    </Typography>
                </div>
                <div className={styles.labels}>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {pool.tokens[0].symbol}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {pool.tokens[1].symbol}
                    </Typography>
                    <div className={styles.fees}>
                        <Typography
                            size="sm"
                            weight="medium"
                            variant="tertiary"
                            uppercase
                        >
                            {t("fees")}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
}
