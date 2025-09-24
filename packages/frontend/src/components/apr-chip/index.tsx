import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import type { PriceRangeSpecification, Weighting } from "@metrom-xyz/sdk";
import { AprInfoTooltip } from "../apr-info-tooltip";

import styles from "./styles.module.css";

interface AprChipProps {
    apr?: number;
    size?: TypographySize;
    prefix?: boolean;
    placeholder?: boolean;
    kpi?: boolean;
    priceRange?: PriceRangeSpecification;
    weighting?: Weighting;
    token0Symbol?: string;
    token1Symbol?: string;
    className?: string;
}

export function AprChip({
    apr,
    size = "sm",
    prefix = false,
    placeholder,
    kpi,
    priceRange,
    weighting,
    token0Symbol,
    token1Symbol,
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
        xl4: ["xl2", "xl4"],
        xl5: ["xl4", "xl5"],
    };

    return (
        <div className={styles.root}>
            {apr !== undefined && (
                <>
                    <AprInfoTooltip
                        priceRange={priceRange}
                        weighting={weighting}
                        token0Symbol={token0Symbol}
                        token1Symbol={token1Symbol}
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
