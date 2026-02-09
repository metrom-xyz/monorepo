import { useTranslations } from "next-intl";
import { TextField, Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import type { AmmPool } from "@metrom-xyz/sdk";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";

import styles from "./styles.module.css";

interface WeightingProps {
    pool: AmmPool;
    weighting: AmmPoolLiquidityCampaignPayload["weighting"];
}

export function Weighting({ pool, weighting }: WeightingProps) {
    const t = useTranslations("campaignPreview.weighting");

    if (!pool || !weighting) return null;

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium">
                {t("title")}
            </Typography>
            <div className={styles.fields}>
                <TextField
                    boxed
                    size="xl"
                    label={pool.tokens[0].symbol}
                    value={formatPercentage({ percentage: weighting.token0 })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={pool.tokens[1].symbol}
                    value={formatPercentage({ percentage: weighting.token1 })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("fees")}
                    value={formatPercentage({
                        percentage: weighting.liquidity,
                    })}
                />
            </div>
        </div>
    );
}
