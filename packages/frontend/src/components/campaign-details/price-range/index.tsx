import {
    Status,
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

    // TODO: in case the campaign has ended this query gets fired
    // while no liquidity density chart is shown. We need to address this somehow.
    // One way could be to add to the hook an "enabled" param that gets passed
    // to react-query. This could be a general thing to apply to react query based hooks
    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity(campaign?.target.pool, COMPUTE_TICKS_AMOUNT);

    if (
        !campaign?.isTargeting(TargetType.AmmPoolLiquidity) ||
        !campaign?.specification?.priceRange
    )
        return null;

    const { priceRange } = campaign.specification;
    const { pool } = campaign.target;

    const fromPrice = tickToScaledPrice(priceRange.from, pool, true);
    const toPrice = tickToScaledPrice(priceRange.to, pool, true);

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <div className={styles.wrapper}>
                <div
                    className={classNames(styles.leftContent, {
                        [styles.leftContentEnded]:
                            campaign.status === Status.Ended,
                    })}
                >
                    <TextField
                        boxed
                        size="xl"
                        label={t("lowerPrice.label")}
                        value={t("lowerPrice.value", {
                            token0: pool.tokens[0].symbol,
                            token1: pool.tokens[1].symbol,
                            price: formatAmount({
                                amount: fromPrice,
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
                                amount: toPrice,
                            }),
                        })}
                    />
                </div>
                {campaign.status !== Status.Ended && (
                    <Card className={styles.card}>
                        <Typography size="sm" uppercase light weight="medium">
                            {t("chart")}
                        </Typography>
                        <div className={classNames(styles.chartWrapper)}>
                            <LiquidityDensityChart
                                pool={pool}
                                from={{
                                    price: fromPrice,
                                    tick: priceRange.from,
                                }}
                                to={{
                                    price: toPrice,
                                    tick: priceRange.to,
                                }}
                                density={liquidityDensity}
                                loading={loadingLiquidityDensity}
                                token0To1
                                showPriceRange
                            />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
