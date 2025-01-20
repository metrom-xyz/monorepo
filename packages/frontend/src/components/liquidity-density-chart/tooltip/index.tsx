import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { AmmPool } from "@metrom-xyz/sdk";
import { formatAmount } from "@/src/utils/format";
import type { ScaledLiquidityTick } from "..";

interface Payload {
    payload: ScaledLiquidityTick;
}

interface TooltipProps {
    active?: boolean;
    pool?: AmmPool;
    payload?: Payload[];
}

export function TooltipContent({ active, pool, payload }: TooltipProps) {
    const t = useTranslations("liquidityDensityChart.tooltip");

    if (!active || !payload || !payload.length) return null;

    const { price0, price1 } = payload[0].payload;

    return (
        <div className={styles.root}>
            <div className={styles.row}>
                <Typography weight="medium" size="xs">
                    {t("price", {
                        token0: pool?.tokens[0].symbol,
                        token1: pool?.tokens[1].symbol,
                        price: formatAmount({
                            amount: price0,
                        }),
                    })}
                </Typography>
            </div>
            <div className={styles.row}>
                <Typography weight="medium" size="xs">
                    {t("price", {
                        token0: pool?.tokens[1].symbol,
                        token1: pool?.tokens[0].symbol,
                        price: formatAmount({ amount: price1 }),
                    })}
                </Typography>
            </div>
        </div>
    );
}
