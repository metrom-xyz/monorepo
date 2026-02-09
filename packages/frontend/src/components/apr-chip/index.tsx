import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { AprInfoTooltip } from "../apr-info-tooltip";
import type { Campaign } from "@/src/types/campaign/common";

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

    return (
        <div className={styles.root}>
            {apr !== undefined && (
                <>
                    {campaign && <AprInfoTooltip campaign={campaign} />}
                    <div
                        className={classNames(styles.chip, className, {
                            [styles.witkKpi]: kpi,
                        })}
                    >
                        <div
                            className={classNames(styles.wrapper, {
                                [styles[size]]: true,
                            })}
                        >
                            {prefix && (
                                <Typography
                                    size={sizes[size][0]}
                                    weight="medium"
                                    className={styles.text}
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
                <Typography size={sizes[size][1]} weight="medium">
                    -
                </Typography>
            )}
        </div>
    );
}
