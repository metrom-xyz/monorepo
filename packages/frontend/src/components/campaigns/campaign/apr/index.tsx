"use client";

import { Skeleton } from "@metrom-xyz/ui";
import { AprChip } from "@/src/components/apr-chip";
import { KpiSimulationChart } from "@/src/components/kpi-simulation-chart";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AprProps {
    apr?: number;
    kpi?: boolean;
}

export function Apr({ apr, kpi }: AprProps) {
    return (
        <div className={styles.root}>
            <AprChip apr={apr} kpi={kpi} placeholder />
        </div>
    );
}

export function SkeletonApr() {
    return <Skeleton width={90} size="xl2" />;
}

export function SkeletonPopover() {
    return (
        <div className={classNames(styles.chartWrapper, styles.loading)}>
            <KpiSimulationChart
                targetValueName=""
                loading={true}
                campaignDurationSeconds={0}
                totalRewardsUsd={0}
            />
        </div>
    );
}
