import {
    type CampaignPayload,
    type CampaignPayloadPart,
    type CampaignPayloadErrors,
    RewardType,
    type TargetedCampaignPayload,
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
import type { SupportedAmm, TargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export interface AmmPoolLiquidityProps {
    unsupportedChain?: boolean;
    payload?: TargetedCampaignPayload<TargetType.AmmPoolLiquidity>;
    onPayloadChange: (part: CampaignPayloadPart) => void;
    onPayloadError: (errors: CampaignPayloadErrors) => void;
}

export function AmmPoolLiquidity({
    unsupportedChain,
    payload,
    onPayloadChange,
    onPayloadError,
}: AmmPoolLiquidityProps) {
    return (
        <div className={styles.root}>
            <DexStep
                disabled={unsupportedChain}
                protocol={payload?.protocol}
                onProtocolChange={onPayloadChange}
            />
            <PoolStep
                disabled={!payload?.protocol || unsupportedChain}
                protocol={payload?.protocol}
                target={payload?.target}
                onTargetChange={onPayloadChange}
            />
            <StartDateStep
                disabled={!payload?.target?.pool || unsupportedChain}
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
                target={payload?.target}
                rewards={payload?.tokens}
                kpiSpecification={payload?.kpiSpecification}
                onKpiChange={onPayloadChange}
                onError={onPayloadError}
            />
            {payload?.target?.pool &&
                AMM_SUPPORTS_RANGE_INCENTIVES[
                    payload?.target.pool.amm as SupportedAmm
                ] && (
                    <RangeStep
                        disabled={!payload?.tokens || unsupportedChain}
                        target={payload.target}
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
