import { Popover } from "@metrom-xyz/ui";
import { InfoMessage } from "../info-message";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { formatPercentage } from "@/src/utils/format";
import { WEIGHT_UNIT } from "@/src/commons";
import type { CampaignItem } from "@/src/types/campaign/common";
import { TargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface AprInfoTooltiProps {
    campaign?: CampaignItem;
    children: ReactNode;
}

export function AprInfoTooltip({ campaign, children }: AprInfoTooltiProps) {
    const [popover, setPopover] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const t = useTranslations("aprInfoTooltip");
    const popoverRef = useRef<HTMLDivElement>(null);

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
                    variant="primary"
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
                    variant="primary"
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
                    variant="primary"
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
                    variant="primary"
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

    function handlePopoverOpen() {
        setPopover(true);
    }

    function handlePopoverClose() {
        setPopover(false);
    }

    if (!priceRange && !weighting && !aaveV3Collateral) return children;

    return (
        <>
            <Popover
                ref={popoverRef}
                open={popover}
                anchor={anchor}
                onOpenChange={setPopover}
                placement="bottom"
                className={styles.root}
            >
                {getInfoMessage()}
            </Popover>
            <div
                ref={setAnchor}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {children}
            </div>
        </>
    );
}
