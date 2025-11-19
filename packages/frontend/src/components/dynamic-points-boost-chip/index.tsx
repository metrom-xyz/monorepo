import {
    SupportedPointsBooster,
    type PointsBoosting,
    type SupportedProtocol,
} from "@metrom-xyz/sdk";
import { useIsAccountBoosted } from "@/src/hooks/useIsAccountBoosted";
import classNames from "classnames";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatPercentage } from "@/src/utils/format";
import { POINTS_BOOSTER_REFERRAL_URLS } from "@/src/commons";
import type { ElementType } from "react";

import styles from "./styles.module.css";

interface DynamicPointsBoostChipProps {
    protocol?: SupportedProtocol;
    boosting?: PointsBoosting;
    asLink?: boolean;
}

export function DynamicPointsBoostChip({
    protocol,
    boosting,
    asLink = false,
}: DynamicPointsBoostChipProps) {
    const t = useTranslations("pointsBoostChip");

    const { loading, active } = useIsAccountBoosted({
        protocol,
        booster: boosting?.type,
        enabled: !!boosting && !!protocol,
    });

    if (!boosting) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [Element, elementProps]: [ElementType, any] = asLink
        ? [
              "a",
              {
                  target: "_blank",
                  rel: "noopener noreferrer",
                  href: POINTS_BOOSTER_REFERRAL_URLS[
                      boosting.type as SupportedPointsBooster
                  ],
              },
          ]
        : ["span", {}];

    return (
        <div className={styles.root}>
            <Element
                {...elementProps}
                className={classNames(styles.chip, {
                    [styles.loading]: loading,
                    [styles.active]: active,
                })}
            >
                <Typography
                    uppercase
                    size="xs"
                    weight="medium"
                    className={classNames(styles.text, {
                        [styles.loading]: loading,
                    })}
                >
                    {t(active ? "boostActive" : "getBoost", {
                        boost: formatPercentage({
                            percentage: (boosting.multiplier - 1) * 100,
                        }),
                    })}
                </Typography>
            </Element>
        </div>
    );
}
