import { useTranslations } from "next-intl";
import { TextField, Typography } from "@metrom-xyz/ui";
import { formatAmount } from "@/src/utils/format";
import type { AmmPool } from "@metrom-xyz/sdk";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";

import styles from "./styles.module.css";

interface RangeProps {
    pool: AmmPool;
    specification: AmmPoolLiquidityCampaignPayload["priceRangeSpecification"];
}

export function Range({ pool, specification }: RangeProps) {
    const t = useTranslations("campaignPreview.range");

    if (!pool || !specification) return null;

    return (
        <div className={styles.root}>
            <Typography uppercase weight="medium">
                {t("title")}
            </Typography>
            <div className={styles.fields}>
                <TextField
                    boxed
                    size="xl"
                    label={t("lowerPrice.label")}
                    value={t("lowerPrice.value", {
                        token0: pool?.tokens[0].symbol,
                        token1: pool?.tokens[1].symbol,
                        price: formatAmount({
                            amount: specification?.from.price,
                        }),
                    })}
                />
                <TextField
                    boxed
                    size="xl"
                    label={t("upperPrice.label")}
                    value={t("upperPrice.value", {
                        token0: pool?.tokens[0].symbol,
                        token1: pool?.tokens[1].symbol,
                        price: formatAmount({
                            amount: specification?.to.price,
                        }),
                    })}
                />
            </div>
        </div>
    );
}
