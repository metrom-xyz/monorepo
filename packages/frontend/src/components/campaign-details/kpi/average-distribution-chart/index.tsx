import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Popover, Typography } from "@metrom-xyz/ui";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import classNames from "classnames";
import type {
    TokenDistributables,
    UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { RankTooltip } from "./tooltip";
import { EmptyState } from "@/src/components/empty-state";

import styles from "./styles.module.css";

interface AverageDistributionChartProps {
    chain?: SupportedChain;
    loading?: boolean;
    distributables?: TokenDistributables;
    kpiMeasurementPercentage?: number;
    minimumPayoutPercentage?: number;
}

export interface AverageDistributionChartData {
    type: "reimbursed" | "distributed";
    color?: string;
    value: number;
}

export function AverageDistributionChart({
    chain,
    loading,
    distributables,
    kpiMeasurementPercentage,
    minimumPayoutPercentage = 0,
}: AverageDistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const [popover, setPopover] =
        useState<AverageDistributionChartData["type"]>();
    const [anchor, setAnchor] = useState<HTMLDivElement | SVGElement | null>(
        null,
    );
    const popoverRef = useRef<HTMLDivElement>(null);

    const assignedPercentages = useMemo(() => {
        if (!kpiMeasurementPercentage || loading) return undefined;

        const normalizedKpiMeasurementPercentage = Math.max(
            Math.min(kpiMeasurementPercentage, 1),
            0,
        );

        const distributed =
            (minimumPayoutPercentage +
                (1 - minimumPayoutPercentage) *
                    normalizedKpiMeasurementPercentage) *
            100;
        const reimbursed = 100 - distributed;

        return {
            distributed,
            reimbursed,
        };
    }, [kpiMeasurementPercentage, minimumPayoutPercentage, loading]);

    const chartData = useMemo(() => {
        if (!assignedPercentages) return undefined;

        const { distributed, reimbursed } = assignedPercentages;

        const data: AverageDistributionChartData[] = [];
        if (distributed > 0) {
            data.push({
                type: "distributed",
                value: distributed,
            });
        }

        if (reimbursed > 0) {
            data.push({
                type: "reimbursed",
                value: reimbursed,
            });
        }

        return data;
    }, [assignedPercentages]);

    const distributionBreakdown = useMemo(() => {
        if (!distributables || !assignedPercentages) return undefined;

        const { amountUsdValue, remainingUsdValue } = distributables;
        const { distributed, reimbursed } = assignedPercentages;

        const assignedUsdValue = amountUsdValue - remainingUsdValue;
        const distributedUsdValue = (assignedUsdValue * distributed) / 100;
        const reimbursedUsdValue = (assignedUsdValue * reimbursed) / 100;

        const distributedList: UsdPricedErc20TokenAmount[] = [];
        const reimbursedList: UsdPricedErc20TokenAmount[] = [];

        distributables.list.forEach(({ amount, remaining, token }) => {
            const assignedAmount = amount.formatted - remaining.formatted;
            const distributedAmount = (assignedAmount * distributed) / 100;
            const reimbursedAmount = (assignedAmount * reimbursed) / 100;

            distributedList.push({
                token,
                amount: {
                    formatted: distributedAmount,
                    raw: 0n,
                    usdValue: distributedAmount * token.usdPrice,
                },
            });
            reimbursedList.push({
                token,
                amount: {
                    formatted: reimbursedAmount,
                    raw: 0n,
                    usdValue: reimbursedAmount * token.usdPrice,
                },
            });
        });

        return {
            distributedUsdValue,
            reimbursedUsdValue,
            distributedList,
            reimbursedList,
        };
    }, [distributables, assignedPercentages]);

    function handlePopoverOnChange() {
        setPopover(popover);
    }

    function getPopoverOpenHandler(type: AverageDistributionChartData["type"]) {
        return () => {
            setPopover(type);
        };
    }

    function handlePopoverClose() {
        setPopover(undefined);
    }

    if (loading)
        return (
            <Card className={styles.root}>
                <Typography
                    uppercase
                    weight="medium"
                    variant="tertiary"
                    size="sm"
                >
                    {t("averageDistribution")}
                </Typography>
                <div
                    className={classNames(styles.chartWrapper, styles.loading)}
                ></div>
            </Card>
        );

    if (!chartData) {
        return (
            <Card className={styles.root}>
                <Typography
                    uppercase
                    weight="medium"
                    variant="tertiary"
                    size="sm"
                >
                    {t("averageDistribution")}
                </Typography>
                <div className={classNames(styles.chartWrapper, styles.empty)}>
                    <EmptyState
                        title={t("empty.title")}
                        subtitle={t("empty.subtitle")}
                    />
                </div>
            </Card>
        );
    }

    const distributionBreakdownList =
        popover === "distributed"
            ? distributionBreakdown?.distributedList
            : distributionBreakdown?.reimbursedList;

    return (
        <Card className={styles.root}>
            <Typography uppercase weight="medium" variant="tertiary" size="sm">
                {t("averageDistribution")}
            </Typography>
            <Popover
                ref={popoverRef}
                placement={
                    popover === "distributed" ? "left-start" : "right-start"
                }
                margin={-52}
                anchor={anchor}
                open={!!popover}
                onOpenChange={handlePopoverOnChange}
            >
                <div className={styles.popoverContent}>
                    <div className={styles.header}>
                        <div className={styles.headerTextWrapper}>
                            <div
                                className={classNames(
                                    styles.legendDot,
                                    popover && {
                                        [styles[popover]]: true,
                                    },
                                )}
                            />
                            <Typography
                                size="sm"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {popover === "distributed"
                                    ? t("distributed")
                                    : t("reimbursed")}
                            </Typography>
                        </div>
                        <Typography size="sm" weight="medium">
                            {formatUsdAmount({
                                amount:
                                    popover === "distributed"
                                        ? distributionBreakdown?.distributedUsdValue
                                        : distributionBreakdown?.reimbursedUsdValue,
                            })}
                        </Typography>
                    </div>
                    {distributionBreakdownList?.map(({ amount, token }) => (
                        <div key={token.address} className={styles.tokenRow}>
                            <div className={styles.tokenWrapper}>
                                <RemoteLogo
                                    size="xs"
                                    address={token.address}
                                    chain={chain}
                                />
                                <Typography size="sm" weight="medium">
                                    {token.symbol}
                                </Typography>
                            </div>
                            <div>
                                <Typography size="sm" weight="medium">
                                    {formatAmount({ amount: amount.formatted })}
                                </Typography>
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    variant="tertiary"
                                >
                                    {formatUsdAmount({
                                        amount: amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>
            </Popover>
            <div className={styles.chartWrapper} ref={setAnchor}>
                <PieChart height={250} width={250} accessibilityLayer={false}>
                    <Pie
                        dataKey="value"
                        animationEasing="ease-in-out"
                        animationDuration={400}
                        cornerRadius={6}
                        // FIXME: the type: "reimbursed" | "distributed" is causing issues with the chart type, fix this
                        data={chartData as unknown as Record<string, unknown>[]}
                        innerRadius={70}
                        outerRadius={113}
                        startAngle={90}
                        endAngle={450}
                        minAngle={5}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                onMouseEnter={getPopoverOpenHandler(entry.type)}
                                onMouseLeave={handlePopoverClose}
                                strokeWidth={5}
                                className={classNames(styles.cell, {
                                    [styles[entry.type]]: true,
                                })}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        active
                        defaultIndex={0}
                        content={<RankTooltip />}
                    />
                </PieChart>
            </div>
        </Card>
    );
}
