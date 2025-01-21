import {
    type CampaignPayload,
    type CampaignPayloadPart,
    type CampaignPayloadErrors,
    RewardType,
    type TargetedCampaignPayload,
} from "@/src/types";
import { StartDateStep } from "../steps/start-date-step";
import { EndDateStep } from "../steps/end-date-step";
import { RewardsStep } from "../steps/rewards-step";
import { RestrictionsStep } from "../steps/restrictions-step";
import { KpiStep } from "../steps/kpi-step";
import type { TargetType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export interface LiquityV2FormProps {
    unsupportedChain?: boolean;
    payload?: TargetedCampaignPayload<TargetType.LiquityV2Debt>;
    onPayloadChange: (part: CampaignPayloadPart) => void;
    onPayloadError: (errors: CampaignPayloadErrors) => void;
}

export function LiquityV2Form({
    unsupportedChain,
    payload,
    onPayloadChange,
    onPayloadError,
}: LiquityV2FormProps) {
    return (
        <div className={styles.root}>
            {/* TODO: implement protocol and action steps */}
            <StartDateStep
                disabled={!payload?.target?.liquityV2Brand || unsupportedChain}
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
            {/* <KpiStep
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
            /> */}
            <RestrictionsStep
                disabled={!payload?.tokens || unsupportedChain}
                restrictions={payload?.restrictions}
                onRestrictionsChange={onPayloadChange}
                onError={onPayloadError}
            />
        </div>
    );
}
