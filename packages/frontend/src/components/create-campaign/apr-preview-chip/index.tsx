import { formatPercentage } from "@/src/utils/format";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface AprPreviewChipProps {
    apr?: number;
    hasKpi?: boolean;
    loading?: boolean;
}

export function AprPreviewChip({ apr, hasKpi, loading }: AprPreviewChipProps) {
    const t = useTranslations("newCampaign.form");

    return (
        <div
            className={classNames(styles.root, {
                [styles.noApr]: apr === undefined,
                [styles.hasKpi]: apr && !!hasKpi,
            })}
        >
            {loading ? (
                <Skeleton size="xs" className={styles.loading} />
            ) : (
                <Typography
                    size="xs"
                    weight="medium"
                    className={classNames({
                        [styles.lightText]: !!apr,
                    })}
                >
                    {t("apr", {
                        apr:
                            apr !== undefined
                                ? formatPercentage({
                                      percentage: apr,
                                  })
                                : "-",
                    })}
                </Typography>
            )}
        </div>
    );
}
