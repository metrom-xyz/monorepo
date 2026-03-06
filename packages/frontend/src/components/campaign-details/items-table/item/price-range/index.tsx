import { TargetType, tickToScaledPrice } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import { useLiquidityDensity } from "@/src/hooks/useLiquidityDensity";
import { LiquidityDensityChart } from "../../../../liquidity-density-chart";
import classNames from "classnames";
import { BoldText } from "../../../../bold-text";
import type { CampaignItem, TargetedNamedCampaign } from "@/src/types/campaign/common";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;

interface PriceRangeProps {
    campaignItem?: TargetedNamedCampaign<
        TargetType.AmmPoolLiquidity,
        CampaignItem
    >;
}

export function PriceRange({ campaignItem }: PriceRangeProps) {
    const t = useTranslations("campaignDetails.priceRange");

    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity({
            pool: campaignItem?.target.pool,
            computeAmount: COMPUTE_TICKS_AMOUNT,
            enabled: campaignItem && !!campaignItem.specification?.priceRange,
        });

    if (
        !campaignItem?.isTargeting(TargetType.AmmPoolLiquidity) ||
        !campaignItem?.specification?.priceRange
    )
        return null;

    const { priceRange } = campaignItem.specification;
    const { pool } = campaignItem.target;

    const fromPrice = tickToScaledPrice(priceRange.from, pool, true);
    const toPrice = tickToScaledPrice(priceRange.to, pool, true);

    return (
        <div className={styles.root}>
            <Typography size="sm" variant="tertiary">
                {t.rich("chart", {
                    token0: pool.tokens[0].symbol,
                    token1: pool.tokens[1].symbol,
                    bold: (chunks) => <BoldText>{chunks}</BoldText>,
                })}
            </Typography>
            <Card className={styles.card}>
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
                        tooltipSize="sm"
                    />
                </div>
            </Card>
        </div>
    );
}
