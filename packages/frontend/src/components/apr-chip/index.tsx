import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { TargetType, type Campaign } from "@metrom-xyz/sdk";
import { AprInfoTooltip } from "../apr-info-tooltip";

import styles from "./styles.module.css";

interface AprChipProps {
    apr?: number;
    size?: TypographySize;
    prefix?: boolean;
    placeholder?: boolean;
    kpi?: boolean;
    campaign?: Campaign;
    className?: string;
}

export function AprChip({
    apr,
    size = "sm",
    prefix = false,
    placeholder,
    kpi,
    campaign,
    className,
}: AprChipProps) {
    const t = useTranslations("aprChip");

    const sizes: Record<typeof size, TypographySize[]> = {
        xs: ["xs", "xs"],
        sm: ["xs", "base"],
        base: ["base", "base"],
        lg: ["base", "lg"],
        xl: ["lg", "xl"],
        xl2: ["xl", "xl2"],
        xl3: ["xl2", "xl4"],
        xl4: ["xl3", "xl4"],
    };

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

    return (
        <div className={styles.root}>
            {apr !== undefined && (
                <>
                    <AprInfoTooltip
                        priceRange={campaign?.specification?.priceRange}
                        weighting={campaign?.specification?.weighting}
                        token0Symbol={token0Symbol}
                        token1Symbol={token1Symbol}
                        aaveV3Collateral={aaveV3Collateral}
                        blacklistedCrossBorrowCollaterals={
                            blacklistedCrossBorrowCollaterals
                        }
                    />
                    <div
                        className={classNames(styles.chip, className, {
                            [styles.witkKpi]: kpi,
                        })}
                    >
                        <div className={classNames(styles.wrapper)}>
                            {prefix && (
                                <Typography
                                    size={sizes[size][0]}
                                    weight="medium"
                                    className={classNames(styles.text)}
                                >
                                    {t("apr")}
                                </Typography>
                            )}
                            <Typography
                                size={sizes[size][1]}
                                weight="medium"
                                className={styles.text}
                            >
                                {formatPercentage({ percentage: apr })}
                            </Typography>
                        </div>
                    </div>
                </>
            )}
            {apr === undefined && placeholder && (
                <Typography
                    size={sizes[size][1]}
                    className={styles.empty}
                    weight="medium"
                >
                    -
                </Typography>
            )}
        </div>
    );
}
