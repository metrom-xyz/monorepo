import { InfoTooltip } from "@metrom-xyz/ui";
import { InfoMessage } from "../info-message";
import type { PriceRangeSpecification, Weighting } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { formatPercentage } from "@/src/utils/format";
import { WEIGHT_UNIT } from "@/src/commons";

import styles from "./styles.module.css";

interface AprInfoTooltiProps {
    priceRange?: PriceRangeSpecification;
    weighting?: Weighting;
    token0Symbol?: string;
    token1Symbol?: string;
}

export function AprInfoTooltip({
    priceRange,
    weighting,
    token0Symbol,
    token1Symbol,
}: AprInfoTooltiProps) {
    const t = useTranslations("aprInfoTooltip");

    const getInfoMessage = useCallback(() => {
        const token0Weight =
            (weighting &&
                formatPercentage({
                    percentage: (weighting.token0 / WEIGHT_UNIT) * 100,
                })) ||
            "";
        const token1Weight =
            (weighting &&
                formatPercentage({
                    percentage: (weighting.token1 / WEIGHT_UNIT) * 100,
                })) ||
            "";
        const feeWeight =
            (weighting &&
                formatPercentage({
                    percentage: (weighting.liquidity / WEIGHT_UNIT) * 100,
                })) ||
            "";

        if (priceRange && weighting)
            return (
                <InfoMessage
                    size="sm"
                    spaced
                    text={t.rich("priceRangeAndWeighting", {
                        feeWeight,
                        token0Weight,
                        token1Weight,
                        token0Symbol: token0Symbol || "",
                        token1Symbol: token1Symbol || "",
                        bold: (chunks) => (
                            <span className={styles.bold}>{chunks}</span>
                        ),
                    })}
                    // TODO: add documentation link
                    // linkText={t("learnMore")}
                    // link=""
                />
            );
        if (priceRange)
            return (
                <InfoMessage
                    size="sm"
                    spaced
                    text={t("priceRange")}
                    // TODO: add documentation link
                    // linkText={t("learnMore")}
                    // link=""
                />
            );
        if (weighting)
            return (
                <InfoMessage
                    size="sm"
                    spaced
                    text={t.rich("weighting", {
                        feeWeight,
                        token0Weight,
                        token1Weight,
                        token0Symbol: token0Symbol || "",
                        token1Symbol: token1Symbol || "",
                        bold: (chunks) => (
                            <span className={styles.bold}>{chunks}</span>
                        ),
                    })}
                    // TODO: add documentation link
                    // linkText={t("learnMore")}
                    // link=""
                />
            );
    }, [token0Symbol, token1Symbol, priceRange, weighting, t]);

    if (!priceRange && !weighting) return null;

    return (
        <InfoTooltip placement="top" className={styles.tooltip}>
            {getInfoMessage()}
        </InfoTooltip>
    );
}
