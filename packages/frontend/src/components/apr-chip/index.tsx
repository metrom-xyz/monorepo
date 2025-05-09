import { Typography, type TypographySize } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface AprChipProps {
    apr?: number;
    size?: TypographySize;
    prefix?: boolean;
    placeholder?: boolean;
    kpi?: boolean;
    className?: string;
}

export function AprChip({
    apr,
    size = "sm",
    prefix = false,
    placeholder,
    kpi,
    className,
}: AprChipProps) {
    const t = useTranslations();

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
        <>
            {apr !== undefined && (
                <div
                    className={classNames(styles.root, className, {
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
        </>
    );
}
