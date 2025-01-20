import {
    Campaign,
    TargetType,
    tickToScaledPrice,
    type TargetedCampaign,
} from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { TextField, Typography } from "@metrom-xyz/ui";
import { formatAmount } from "@/src/utils/format";
import { useTicks } from "@/src/hooks/useTicks";
import { LiquidityDensityChart } from "../../liquidity-density-chart";
import classNames from "classnames";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;

interface PriceRangeProps {
    campaign?: TargetedCampaign<TargetType.AmmPoolLiquidity>;
}

export function PriceRange({ campaign }: PriceRangeProps) {
    const t = useTranslations("campaignDetails.priceRange");

    const { ticks, loading: loadingTicks } = useTicks(
        campaign?.target.pool,
        COMPUTE_TICKS_AMOUNT,
    );

    if (
        !campaign?.isTargeting(TargetType.AmmPoolLiquidity) ||
        !campaign?.specification?.priceRange
    )
        return null;

    const { priceRange } = campaign.specification;
    const { pool } = campaign.target;

    return (
        <div className={styles.root}>
            <div className={styles.card}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                <div className={styles.topContent}>
                    <TextField
                        boxed
                        size="xl"
                        label={t("lowerPrice.label")}
                        value={t("lowerPrice.value", {
                            token0: pool.tokens[0].symbol,
                            token1: pool.tokens[1].symbol,
                            price: formatAmount({
                                amount: tickToScaledPrice(
                                    priceRange.from,
                                    pool,
                                ),
                            }),
                        })}
                    />
                    <TextField
                        boxed
                        size="xl"
                        label={t("upperPrice.label")}
                        value={t("upperPrice.value", {
                            token0: pool.tokens[0].symbol,
                            token1: pool.tokens[1].symbol,
                            price: formatAmount({
                                amount: tickToScaledPrice(priceRange.to, pool),
                            }),
                        })}
                    />
                </div>
                <div className={styles.chart}>
                    <Typography size="sm" uppercase light weight="medium">
                        {t("chart")}
                    </Typography>
                    <div className={classNames(styles.chartWrapper)}>
                        <LiquidityDensityChart
                            pool={pool}
                            from={priceRange.from}
                            to={priceRange.to}
                            ticks={ticks}
                            loading={loadingTicks}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
