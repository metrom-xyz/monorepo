import {
    Status,
    TargetType,
    tickToScaledPrice,
    type TargetedCampaign,
} from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { Card, Typography } from "@metrom-xyz/ui";
import { useLiquidityDensity } from "@/src/hooks/useLiquidityDensity";
import { LiquidityDensityChart } from "../../liquidity-density-chart";
import classNames from "classnames";
import { BoldText } from "../../bold-text";

import styles from "./styles.module.css";

const COMPUTE_TICKS_AMOUNT = 3000;

interface PriceRangeProps {
    campaign?: TargetedCampaign<TargetType.AmmPoolLiquidity>;
}

export function PriceRange({ campaign }: PriceRangeProps) {
    const t = useTranslations("campaignDetails.priceRange");

    const { liquidityDensity, loading: loadingLiquidityDensity } =
        useLiquidityDensity({
            pool: campaign?.target.pool,
            computeAmount: COMPUTE_TICKS_AMOUNT,
            enabled:
                campaign &&
                !!campaign.specification?.priceRange &&
                campaign.status !== Status.Expired,
        });

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
                {campaign.status !== Status.Expired && (
                    <Card className={styles.card}>
                        <Typography
                            size="sm"
                            uppercase
                            variant="tertiary"
                            weight="medium"
                        >
                            {t.rich("chart", {
                                token0: pool.tokens[0].symbol,
                                token1: pool.tokens[1].symbol,
                                bold: (chunks) => <BoldText>{chunks}</BoldText>,
                            })}
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
                                tooltipSize="sm"
                            />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
