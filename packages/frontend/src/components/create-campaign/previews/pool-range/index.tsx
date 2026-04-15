import { useTranslations } from "next-intl";
import { Typography } from "@metrom-xyz/ui";
import type { AugmentedPriceRangeSpecification } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { FormStepPreview } from "../../form-step-preview";
import { useFormSteps } from "@/src/context/form-steps";
import type { AmmPool } from "@metrom-xyz/sdk";
import { formatAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface PoolRangeProps {
    pool?: AmmPool;
    priceRangeSpecification?: Partial<AugmentedPriceRangeSpecification>;
}

export function PoolRange({ pool, priceRangeSpecification }: PoolRangeProps) {
    const t = useTranslations("newCampaign.formPreview");
    const { errors } = useFormSteps();

    if (!pool || !priceRangeSpecification) return null;

    const { from, to } = priceRangeSpecification;

    return (
        <FormStepPreview
            title={
                <Typography size="xs" weight="semibold" uppercase>
                    {t("rangeToReward")}
                </Typography>
            }
            completed
            error={!!errors.range}
        >
            <div className={styles.range}>
                <div className={styles.price}>
                    <Typography size="sm" weight="medium" uppercase>
                        {t("price", {
                            token0: pool?.tokens[0].symbol,
                            token1: pool?.tokens[1].symbol,
                            price: formatAmount({
                                amount: from?.price,
                            }),
                        })}
                    </Typography>
                    <Typography
                        size="sm"
                        weight="medium"
                        uppercase
                        variant="tertiary"
                    >
                        {t("minPrice")}
                    </Typography>
                </div>
                <div className={styles.price}>
                    <Typography size="sm" weight="medium" uppercase>
                        {t("price", {
                            token0: pool?.tokens[0].symbol,
                            token1: pool?.tokens[1].symbol,
                            price: formatAmount({
                                amount: to?.price,
                            }),
                        })}
                    </Typography>
                    <Typography
                        size="sm"
                        weight="medium"
                        uppercase
                        variant="tertiary"
                    >
                        {t("maxPrice")}
                    </Typography>
                </div>
            </div>
        </FormStepPreview>
    );
}
