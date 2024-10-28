import { Typography, type TypographyVariant } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface AprChipProps {
    apr: number | null;
    size?: "sm" | "lg";
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
    const t = useTranslations("apr");

    const sizes: Record<typeof size, TypographyVariant[]> = {
        sm: ["xs", "base"],
        lg: ["base", "lg"],
    };

    return (
        <>
            {apr && (
                <div
                    className={classNames(styles.root, className, {
                        [styles.witkKpi]: kpi,
                    })}
                >
                    <div className={classNames(styles.wrapper)}>
                        {prefix && (
                            <Typography
                                variant={sizes[size][0]}
                                weight="medium"
                                className={classNames(styles.text)}
                            >
                                {t("apr")}
                            </Typography>
                        )}
                        {kpi && (
                            <Typography
                                variant={sizes[size][0]}
                                weight="medium"
                                className={classNames(styles.text)}
                            >
                                {t("upTo")}
                            </Typography>
                        )}
                        <Typography
                            variant={sizes[size][1]}
                            weight="medium"
                            className={styles.text}
                        >
                            {formatPercentage(apr)}
                        </Typography>
                    </div>
                </div>
            )}
            {!apr && placeholder && (
                <Typography
                    variant={sizes[size][1]}
                    className={styles.empty}
                    weight="medium"
                >
                    -
                </Typography>
            )}
        </>
    );
}
