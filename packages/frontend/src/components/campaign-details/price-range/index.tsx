import {
    TargetType,
    tickToScaledPrice,
    type TargetedCampaign,
} from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { Card, TextField, Typography } from "@metrom-xyz/ui";
import { formatAmount } from "@/src/utils/format";
import { useLiquidityDensity } from "@/src/hooks/useLiquidityDensity";
import { LiquidityDensityChart } from "../../liquidity-density-chart";
import classNames from "classnames";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;

interface PriceRangeProps {
    campaign?: TargetedCampaign<TargetType.AmmPoolLiquidity>;
}

export function PriceRange({ campaign }: PriceRangeProps) {
    const t = useTranslations("campaignDetails.priceRange");

    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity(campaign?.target.pool, COMPUTE_TICKS_AMOUNT);

    if (
        !campaign?.isTargeting(TargetType.AmmPoolLiquidity) ||
        !campaign?.specification?.priceRange
    )
        return null;

    const { priceRange } = campaign.specification;
    const { pool } = campaign.target;

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.wrapper}>
                <div className={styles.leftContent}>
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
                                    true,
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
                                amount: tickToScaledPrice(
                                    priceRange.to,
                                    pool,
                                    true,
                                ),
                            }),
                        })}
                    />
                </div>
                <Card className={styles.card}>
                    <Typography size="sm" uppercase light weight="medium">
                        {t("chart")}
                    </Typography>
                    <div className={classNames(styles.chartWrapper)}>
                        <LiquidityDensityChart
                            pool={pool}
                            from={priceRange.from}
                            to={priceRange.to}
                            density={liquidityDensity}
                            loading={loadingLiquidityDensity}
                            token0To1
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
