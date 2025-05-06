import { useTranslations } from "next-intl";
import { TextField, Typography } from "@metrom-xyz/ui";
import type { AmmPool, Specification, Weighting } from "@metrom-xyz/sdk";
import { formatPercentage } from "@/src/utils/format";
import { WEIGHT_UNIT } from "@/src/commons";

import styles from "./styles.module.css";

interface WeightingProps {
    specification?: Specification;
    pool?: AmmPool;
}

export function Weighting({ specification, pool }: WeightingProps) {
    const t = useTranslations("campaignDetails.weighting");

    if (!specification || !specification.weighting || !pool) return null;

    const { token0, token1, liquidity } = specification.weighting;

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.tokensWrapper}>
                <TextField
                    boxed
                    size="xl"
                    label={pool.tokens[0].symbol}
                    value={formatPercentage({
                        percentage: (token0 / WEIGHT_UNIT) * 100,
                    })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={pool.tokens[1].symbol}
                    value={formatPercentage({
                        percentage: (token1 / WEIGHT_UNIT) * 100,
                    })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("fees")}
                    value={formatPercentage({
                        percentage: (liquidity / WEIGHT_UNIT) * 100,
                    })}
                />
            </div>
        </div>
    );
}
