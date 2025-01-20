import {
    type CampaignPayload,
    type CampaignPayloadPart,
    type CampaignPayloadErrors,
    RewardType,
} from "@/src/types";
import { DexStep } from "../steps/dex-step";
import { PoolStep } from "../steps/pool-step";
import { StartDateStep } from "../steps/start-date-step";
import { EndDateStep } from "../steps/end-date-step";
import { RewardsStep } from "../steps/rewards-step";
import { RestrictionsStep } from "../steps/restrictions-step";
import { KpiStep } from "../steps/kpi-step";
import { RangeStep } from "../steps/range-step";
import { AMM_SUPPORTS_RANGE_INCENTIVES } from "@/src/commons";
import type { SupportedAmm } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export interface AmmFormProps {
    unsupportedChain?: boolean;
    payload?: CampaignPayload;
    onPayloadChange: (part: CampaignPayloadPart) => void;
    onPayloadError: (errors: CampaignPayloadErrors) => void;
}

export function AmmForm({
    unsupportedChain,
    payload,
    onPayloadChange,
    onPayloadError,
}: AmmFormProps) {
    return (
        <div className={styles.root}>
            <DexStep
                disabled={unsupportedChain}
                dex={payload?.dex}
                onDexChange={onPayloadChange}
            />
            <PoolStep
                disabled={!payload?.dex || unsupportedChain}
                dex={payload?.dex}
                pool={payload?.pool}
                onPoolChange={onPayloadChange}
            />
            <StartDateStep
                disabled={!payload?.pool || unsupportedChain}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onStartDateChange={onPayloadChange}
                onError={onPayloadError}
            />
            <EndDateStep
                disabled={!payload?.startDate || unsupportedChain}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onEndDateChange={onPayloadChange}
                onError={onPayloadError}
            />
            <RewardsStep
                disabled={!payload?.endDate || unsupportedChain}
                rewardType={payload?.rewardType}
                pool={payload?.pool}
                tokens={payload?.tokens}
                points={payload?.points}
                fee={payload?.fee}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onRewardsChange={onPayloadChange}
                onError={onPayloadError}
            />
            <KpiStep
                disabled={
                    !payload?.tokens ||
                    payload.rewardType === RewardType.Points ||
                    unsupportedChain
                }
                pool={payload?.pool}
                rewards={payload?.tokens}
                kpiSpecification={payload?.kpiSpecification}
                onKpiChange={onPayloadChange}
                onError={onPayloadError}
            />
            {payload?.pool &&
                AMM_SUPPORTS_RANGE_INCENTIVES[
                    payload.pool.amm as SupportedAmm
                ] && (
                    <RangeStep
                        disabled={!payload?.tokens || unsupportedChain}
                        pool={payload.pool}
                        priceRangeSpecification={
                            payload?.priceRangeSpecification
                        }
                        onRangeChange={onPayloadChange}
                        onError={onPayloadError}
                    />
                )}
            <RestrictionsStep
                disabled={!payload?.tokens || unsupportedChain}
                restrictions={payload?.restrictions}
                onRestrictionsChange={onPayloadChange}
                onError={onPayloadError}
            />
        </div>
    );
}
