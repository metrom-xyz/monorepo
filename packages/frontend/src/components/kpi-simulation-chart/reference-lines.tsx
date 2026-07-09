import { useMemo } from "react";
import {
    Label,
    ReferenceLine,
    useXAxisScale,
    type ReferenceLineSegment,
} from "recharts";
import { useTranslations } from "next-intl";
import classNames from "classnames";

import styles from "./styles.module.css";

const REFERENCE_LINE_PROXIMITY_THRESHOLD = 16;
const REFERENCE_LINE_LABEL_DX = 10;

interface TargetReferenceLinesProps {
    targetValueName: string;
    targetUsdValue: number;
    lowerUsdTarget: number;
    upperUsdTarget: number;
    totalRewardsUsd: number;
    campaignEnded?: boolean;
    complex?: boolean;
}

// Rendered inside the chart, so the recharts scale hooks can be used to
// resolve the pixel position of the reference lines and adjust the label
// offsets when they get too close to one another.
export function TargetReferenceLines({
    targetValueName,
    targetUsdValue,
    lowerUsdTarget,
    upperUsdTarget,
    totalRewardsUsd,
    campaignEnded,
    complex,
}: TargetReferenceLinesProps) {
    const t = useTranslations("simulationChart");
    const xScale = useXAxisScale();

    const poolTvlScale = xScale?.(targetUsdValue);
    const lowerBoundScale = xScale?.(lowerUsdTarget);
    const upperBoundScale = xScale?.(upperUsdTarget);

    const { poolTvlDx, lowerBoundDx, upperBoundDx } = useMemo(() => {
        if (
            poolTvlScale === undefined ||
            lowerBoundScale === undefined ||
            upperBoundScale === undefined
        )
            return {
                poolTvlDx: REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };

        const closeToLowerBound =
            Math.abs(poolTvlScale - lowerBoundScale) <=
            REFERENCE_LINE_PROXIMITY_THRESHOLD;
        const closeToUpperBound =
            Math.abs(poolTvlScale - upperBoundScale) <=
            REFERENCE_LINE_PROXIMITY_THRESHOLD;
        const closeBounds =
            upperBoundScale - lowerBoundScale <=
            REFERENCE_LINE_PROXIMITY_THRESHOLD;

        if (closeBounds) {
            return {
                poolTvlDx: REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: -REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };
        }

        if (closeToLowerBound) {
            if (poolTvlScale <= lowerBoundScale)
                return {
                    poolTvlDx: -REFERENCE_LINE_LABEL_DX,
                    lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                    upperBoundDx: REFERENCE_LINE_LABEL_DX,
                };

            return {
                poolTvlDx: REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: -REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };
        }

        if (closeToUpperBound) {
            if (poolTvlScale >= upperBoundScale)
                return {
                    poolTvlDx: REFERENCE_LINE_LABEL_DX,
                    lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                    upperBoundDx: -REFERENCE_LINE_LABEL_DX,
                };

            return {
                poolTvlDx: -REFERENCE_LINE_LABEL_DX,
                lowerBoundDx: REFERENCE_LINE_LABEL_DX,
                upperBoundDx: REFERENCE_LINE_LABEL_DX,
            };
        }

        return {
            poolTvlDx: REFERENCE_LINE_LABEL_DX,
            lowerBoundDx: REFERENCE_LINE_LABEL_DX,
            upperBoundDx: REFERENCE_LINE_LABEL_DX,
        };
    }, [lowerBoundScale, poolTvlScale, upperBoundScale]);

    const targetValueReferenceLineSegment: ReferenceLineSegment =
        useMemo(() => {
            return [
                {
                    x: targetUsdValue,
                    y: 0,
                },
                {
                    x: targetUsdValue,
                    y: totalRewardsUsd,
                },
            ];
        }, [targetUsdValue, totalRewardsUsd]);

    const lowerBoundReferenceLineSegment: ReferenceLineSegment = useMemo(
        () => [
            {
                x: lowerUsdTarget,
                y: 0,
            },
            {
                x: lowerUsdTarget,
                y: totalRewardsUsd,
            },
        ],
        [lowerUsdTarget, totalRewardsUsd],
    );

    const upperBoundReferenceLineSegment: ReferenceLineSegment = useMemo(
        () => [
            {
                x: upperUsdTarget,
                y: 0,
            },
            {
                x: upperUsdTarget,
                y: totalRewardsUsd,
            },
        ],
        [totalRewardsUsd, upperUsdTarget],
    );

    return (
        <>
            <ReferenceLine
                strokeDasharray={"4 4"}
                ifOverflow="visible"
                segment={targetValueReferenceLineSegment}
                className={classNames(styles.referenceLine, styles.green)}
            >
                {!complex && (
                    <Label
                        value={
                            campaignEnded
                                ? t("targetValue.campaignEnded", {
                                      targetValueName,
                                  })
                                : t("targetValue.campaignActive", {
                                      targetValueName,
                                  })
                        }
                        dx={poolTvlDx}
                        angle={90}
                        className={classNames(styles.axisLabel, {
                            [styles.complex]: complex,
                        })}
                    />
                )}
            </ReferenceLine>

            <ReferenceLine
                strokeDasharray={"4 4"}
                ifOverflow="visible"
                segment={lowerBoundReferenceLineSegment}
                className={styles.referenceLine}
            >
                {!complex && (
                    <Label
                        value={t("lowerBound")}
                        dx={lowerBoundDx}
                        angle={270}
                        className={classNames(styles.axisLabel, {
                            [styles.complex]: complex,
                        })}
                    />
                )}
            </ReferenceLine>

            <ReferenceLine
                strokeDasharray={"4 4"}
                ifOverflow="visible"
                segment={upperBoundReferenceLineSegment}
                className={styles.referenceLine}
            >
                {!complex && (
                    <Label
                        value={t("upperBound")}
                        dx={upperBoundDx}
                        angle={90}
                        className={styles.axisLabel}
                    />
                )}
            </ReferenceLine>
        </>
    );
}
