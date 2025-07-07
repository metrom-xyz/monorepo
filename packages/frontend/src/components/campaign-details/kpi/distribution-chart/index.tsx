import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useCallback, useMemo, useState } from "react";
import type {
    DistributablesCampaign,
    DistributablesType,
    KpiRewardDistribution,
} from "@metrom-xyz/sdk";
import dayjs from "dayjs";
import { TooltipContent } from "./tooltip";
import { Card, Chip, Skeleton, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { NoDistributionsIcon } from "@/src/assets/no-distributions-icon";
import { useKpiMeasurements } from "@/src/hooks/useKpiMeasurements";
import { getAggregatedKpiMeasurements } from "@/src/utils/kpi";
import { AnimatePresence, easeInOut, motion } from "motion/react";

import styles from "./styles.module.css";

export interface DistributionChartData {
    from: number;
    to: number;
    distributions: KpiRewardDistribution[];
    distributed: number;
    reimbursed: number;
}

interface DistributionChartProps {
    campaign?: DistributablesCampaign<DistributablesType.Tokens>;
    minimumPayoutPercentage?: number;
    loading?: boolean;
}

const THREE_HOURS_SECONDS = 60 * 60 * 3;
const ONE_DAY_SECONDS = 60 * 60 * 24;

export function DistributionChart({
    campaign,
    minimumPayoutPercentage = 0,
    loading,
}: DistributionChartProps) {
    const t = useTranslations("campaignDetails.kpi.charts");

    const [week, setWeek] = useState<number>();
    const [from, setFrom] = useState<number>();
    const [to, setTo] = useState<number>();

    const { kpiMeasurements, loading: loadingKpiMeasurements } =
        useKpiMeasurements({ campaign, from, to });

    const chartData: DistributionChartData[] = useMemo(() => {
        if (!kpiMeasurements || kpiMeasurements.length === 0) return [];

        const fullTimeRange =
            kpiMeasurements[kpiMeasurements.length - 1].to -
            kpiMeasurements[0].from;

        let aggregated;
        if (fullTimeRange < ONE_DAY_SECONDS) aggregated = kpiMeasurements;
        else
            aggregated = aggregated = getAggregatedKpiMeasurements(
                kpiMeasurements,
                THREE_HOURS_SECONDS,
            );

        return aggregated.map((measurement) => {
            const { percentage } = measurement;

            const normalizedPercentage = Math.max(Math.min(percentage, 1), 0);
            const distributedPercentage =
                minimumPayoutPercentage +
                (1 - minimumPayoutPercentage) * normalizedPercentage;

            return {
                ...measurement,
                distributed: distributedPercentage,
                reimbursed: 1 - distributedPercentage,
            };
        });
    }, [kpiMeasurements, minimumPayoutPercentage]);

    const weeksCount = useMemo(() => {
        if (!campaign) return 0;

        const campaignDaysDuration =
            dayjs
                .unix(Math.min(campaign.to, dayjs().unix()))
                .diff(dayjs.unix(campaign.from), "hours") / 24;
        const weeks = campaignDaysDuration / 7;

        return weeks > 1 ? weeks : 0;
    }, [campaign]);

    const getWeekOnClickHandler = useCallback(
        (newWeek: number) => {
            return () => {
                if (!campaign) return;

                if (week === newWeek) {
                    setFrom(undefined);
                    setTo(undefined);
                    setWeek(undefined);
                    return;
                }

                const from = dayjs
                    .unix(campaign.from)
                    .utc()
                    .add(newWeek, "weeks")
                    .unix();
                const to = dayjs.unix(from).utc().add(1, "weeks").unix();

                setWeek(newWeek);
                setFrom(from);
                setTo(to);
            };
        },
        [campaign, week],
    );

    if (!campaign || loading)
        return (
            <Card className={styles.root}>
                <div className={styles.header}>
                    <Typography weight="medium" light uppercase size="sm">
                        {t("distributions")}
                    </Typography>
                    <div
                        className={classNames(
                            styles.rightContent,
                            styles.loading,
                        )}
                    >
                        <Skeleton
                            width={33}
                            size="xl"
                            className={styles.skeletonChip}
                        />
                        <Skeleton
                            width={33}
                            size="xl"
                            className={styles.skeletonChip}
                        />
                        <Skeleton
                            width={33}
                            size="xl"
                            className={styles.skeletonChip}
                        />
                    </div>
                </div>
                <div className={classNames(styles.container, styles.loading)}>
                    {Array.from({ length: 35 }).map((_, index) => (
                        <div key={index} className={styles.loadingBar}></div>
                    ))}
                </div>
            </Card>
        );

    if (
        !loadingKpiMeasurements &&
        (!kpiMeasurements || kpiMeasurements.length === 0)
    ) {
        return (
            <Card className={styles.root}>
                <Typography weight="medium" light uppercase size="sm">
                    {t("distributions")}
                </Typography>
                <div className={classNames(styles.container, styles.empty)}>
                    <NoDistributionsIcon />
                    <Typography uppercase weight="medium" size="sm">
                        {t("noDistribution")}
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <Card className={styles.root}>
            <div className={styles.header}>
                <div className={styles.leftContent}>
                    <Typography weight="medium" light uppercase size="sm">
                        {t("distributions")}
                    </Typography>
                    <AnimatePresence>
                        {from && to && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ ease: easeInOut, duration: 0.2 }}
                            >
                                <Typography weight="medium" size="xs">
                                    {t("weekDuration", {
                                        from: dayjs
                                            .unix(from)
                                            .format("DD MMM")
                                            .toUpperCase(),
                                        to: dayjs
                                            .unix(to)
                                            .format("DD MMM")
                                            .toUpperCase(),
                                    })}
                                </Typography>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className={styles.rightContent}>
                    {Array.from({ length: weeksCount }).map((_, index) => (
                        <Chip
                            key={index}
                            size="xs"
                            clickable={!loadingKpiMeasurements}
                            active={index === week}
                            onClick={getWeekOnClickHandler(index)}
                        >
                            {t("week", { week: index + 1 })}
                        </Chip>
                    ))}
                </div>
            </div>
            {loadingKpiMeasurements ? (
                <div className={classNames(styles.container, styles.loading)}>
                    {Array.from({ length: 35 }).map((_, index) => (
                        <div key={index} className={styles.loadingBar}></div>
                    ))}
                </div>
            ) : (
                <ResponsiveContainer width="100%" className={styles.container}>
                    <BarChart
                        data={chartData}
                        style={{ cursor: "pointer" }}
                        accessibilityLayer={false}
                    >
                        <YAxis ticks={[0, 1]} hide />
                        <XAxis
                            type="category"
                            dataKey="to"
                            height={20}
                            padding={{ left: 0, right: 0 }}
                            tickSize={4}
                            interval={"preserveStartEnd"}
                            axisLine={false}
                            tick={<Tick />}
                        />

                        <Bar
                            dataKey="distributed"
                            stackId="distribution"
                            className={styles.distributedBar}
                        />
                        <Bar
                            dataKey="reimbursed"
                            stackId="distribution"
                            radius={[6, 6, 0, 0]}
                            className={styles.reimbursedBar}
                        />

                        <Tooltip
                            position={{ y: -100 }}
                            isAnimationActive={false}
                            cursor={false}
                            content={
                                <TooltipContent chain={campaign?.chainId} />
                            }
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}

interface TickProps {
    payload?: {
        value: number;
    };
    x?: number;
    y?: number;
}

function Tick({ payload, x, y }: TickProps) {
    if (!payload?.value) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                fontSize={12}
                textAnchor="middle"
                className={styles.timeTick}
            >
                {dayjs.unix(payload.value).format("DD MMM HH:mm")}
            </text>
        </g>
    );
}
