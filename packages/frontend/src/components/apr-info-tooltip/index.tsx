import { InfoTooltip } from "@metrom-xyz/ui";
import { InfoMessage } from "../info-message";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { formatPercentage } from "@/src/utils/format";
import { WEIGHT_UNIT } from "@/src/commons";
import type { Campaign } from "@/src/types/campaign/common";
import { TargetType } from "@metrom-xyz/sdk";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AprInfoTooltiProps {
    campaign: Campaign;
    className?: string;
}

export function AprInfoTooltip({ campaign, className }: AprInfoTooltiProps) {
    const t = useTranslations("aprInfoTooltip");

    const ammPoolLiquidityCampaign = campaign?.isTargeting(
        TargetType.AmmPoolLiquidity,
    );
    const aaveV3NetSupplyCampaign = campaign?.isTargeting(
        TargetType.AaveV3NetSupply,
    );
    const token0Symbol = ammPoolLiquidityCampaign
        ? campaign.target.pool.tokens[0].symbol
        : undefined;
    const token1Symbol = ammPoolLiquidityCampaign
        ? campaign.target.pool.tokens[1].symbol
        : undefined;
    const blacklistedCrossBorrowCollaterals = aaveV3NetSupplyCampaign
        ? campaign.target.blacklistedCrossBorrowCollaterals
        : undefined;
    const aaveV3Collateral = aaveV3NetSupplyCampaign
        ? campaign.target.collateral
        : undefined;

    const weighting = campaign?.specification?.weighting;
    const priceRange = campaign?.specification?.priceRange;

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
                    weight="regular"
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
                    weight="regular"
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
                    weight="regular"
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
        if (aaveV3Collateral)
            return (
                <InfoMessage
                    size="sm"
                    spaced
                    text={t.rich("aaveV3NetSupply", {
                        collateral: aaveV3Collateral.symbol,
                        blacklisted:
                            blacklistedCrossBorrowCollaterals &&
                            blacklistedCrossBorrowCollaterals.length > 0
                                ? `, ${blacklistedCrossBorrowCollaterals
                                      .map(({ symbol }) => symbol)
                                      .join(", ")}`
                                : "",
                        bold: (chunks) => (
                            <span className={styles.bold}>{chunks}</span>
                        ),
                    })}
                    // TODO: add documentation link
                    // linkText={t("learnMore")}
                    // link=""
                />
            );
    }, [
        token0Symbol,
        token1Symbol,
        priceRange,
        weighting,
        aaveV3Collateral,
        blacklistedCrossBorrowCollaterals,
        t,
    ]);

    if (!priceRange && !weighting && !aaveV3Collateral) return null;

    return (
        <InfoTooltip className={classNames(styles.tooltip, className)}>
            {getInfoMessage()}
        </InfoTooltip>
    );
}
