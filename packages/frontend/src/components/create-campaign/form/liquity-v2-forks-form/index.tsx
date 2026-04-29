import {
    type CampaignPreviewFixedDistribution,
    type CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";
import { useCallback, useMemo, useState } from "react";
import { DistributablesType } from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import {
    getLiquityV2TargetValue,
    LiquityV2CampaignPreviewPayload,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types/campaign/liquity-v2-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import {
    allFieldsFilled,
    distributablesCompleted,
    validateDistributables,
    validateDistributions,
} from "@/src/utils/form";
import {
    LIQUITY_V2_BASIC_PAYLOAD_KEYS,
    LiquityV2BasicsStep,
} from "./liquity-v2-basics-step";
import { useFormSteps } from "@/src/context/form-steps";
import { FormStepId } from "@/src/types/form";
import { LiquityV2RewardsStep } from "./liquity-v2-rewards-step";
import { CampaignKpiStep } from "../../steps/campaign-kpi-step";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: LiquityV2CampaignPayload,
): LiquityV2CampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        kind,
        brand,
        collateral,
        startDate,
        endDate,
        distributables,
        kpiDistribution,
        fixedDistribution,
        restrictions,
    } = payload;

    if (
        !kind ||
        !brand ||
        !collateral ||
        !startDate ||
        !endDate ||
        !distributables
    )
        return null;

    if (!validateDistributables(distributables)) return null;
    if (!validateDistributions(kpiDistribution, fixedDistribution)) return null;

    // TODO: handle chain type for same chain ids?
    if (EXPERIMENTAL_CHAINS.includes(chainId)) {
        return new EmptyTargetCampaignPreviewPayload(
            chainId,
            startDate,
            endDate,
            distributables,
            kpiDistribution as CampaignPreviewKpiDistribution,
            fixedDistribution as CampaignPreviewFixedDistribution,
            restrictions,
        );
    }

    return new LiquityV2CampaignPreviewPayload(
        kind,
        brand,
        collateral,
        chainId,
        startDate,
        endDate,
        distributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface LiquityV2ForksFormProps {
    distributablesType: DistributablesType;
    onStepComplete: (payload: LiquityV2CampaignPayloadPart) => void;
    onLaunch: () => void;
}

export function LiquityV2ForksForm({
    distributablesType,
    onStepComplete,
    onLaunch,
}: LiquityV2ForksFormProps) {
    const [payload, setPayload] = useState<LiquityV2CampaignPayload>({
        distributables: { type: distributablesType },
    });

    const { errors, unsaved, activeStepId, updateActiveStepId } =
        useFormSteps();

    const validatedPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error) || !payload.chainId)
            return null;
        return validatePayload(payload.chainId, payload);
    }, [payload, errors]);

    const steps: FormStepId[] = useMemo(
        () => [
            FormStepId.Basics,
            FormStepId.Rewards,
            ...(distributablesType === DistributablesType.Tokens
                ? [FormStepId.Kpi]
                : []),
            FormStepId.Launch,
        ],
        [distributablesType],
    );

    const handleOnApply = useCallback(
        (part: LiquityV2CampaignPayloadPart, stepId: FormStepId) => {
            setPayload((prev) => ({ ...prev, ...part }));
            onStepComplete({ ...payload, ...part });

            const currentIndex = steps.indexOf(activeStepId);
            const appliedStepIndex = steps.indexOf(stepId);

            const nextStepIndex =
                currentIndex > appliedStepIndex
                    ? currentIndex
                    : appliedStepIndex + 1;

            const next = steps[nextStepIndex];
            if (!next) return;
            updateActiveStepId(next);
        },
        [payload, activeStepId, steps, onStepComplete, updateActiveStepId],
    );

    const targetUsdValue = getLiquityV2TargetValue(payload)?.usd;
    const unsavedSteps = Object.values(unsaved).some((item) => !!item);

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <LiquityV2BasicsStep
                    payload={payload}
                    onApply={handleOnApply}
                />
                <LiquityV2RewardsStep
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(payload, LIQUITY_V2_BASIC_PAYLOAD_KEYS)
                    }
                    onApply={handleOnApply}
                />
                <CampaignKpiStep
                    payload={payload}
                    targetUsdValue={targetUsdValue}
                    disabled={
                        !!errors.rewards || !distributablesCompleted(payload)
                    }
                    onApply={handleOnApply}
                />
                <CampaignApproveLaunchStep
                    payload={validatedPayload}
                    disabled={
                        unsavedSteps ||
                        !validatedPayload ||
                        !!Object.values(errors).some((error) => !!error) ||
                        !distributablesCompleted(payload)
                    }
                    onLaunch={onLaunch}
                />
            </div>
        </div>
    );
}
