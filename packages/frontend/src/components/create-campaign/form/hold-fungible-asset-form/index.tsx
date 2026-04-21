import {
    type CampaignPreviewFixedDistribution,
    type CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";
import { useCallback, useMemo, useState } from "react";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import {
    HoldFungibleAssetCampaignPreviewPayload,
    type HoldFungibleAssetCampaignPayload,
    type HoldFungibleAssetCampaignPayloadPart,
} from "@/src/types/campaign/hold-fungible-asset-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import {
    allFieldsFilled,
    distributablesCompleted,
    validateDistributables,
} from "@/src/utils/form";
import { validateDistributions } from "@/src/utils/creation-form";
import type { LiquityV2CampaignPayloadPart } from "@/src/types/campaign/liquity-v2-campaign";
import { useFormSteps } from "@/src/context/form-steps";
import { FormStepId } from "@/src/types/form";
import {
    HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS,
    HoldFungibleAssetBasicsStep,
} from "./hold-fungible-asset-basics-step";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";
import { HoldFungibleAssetRewardsStep } from "./hold-fungible-asset-rewards-step";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: HoldFungibleAssetCampaignPayload,
):
    | HoldFungibleAssetCampaignPreviewPayload
    | EmptyTargetCampaignPreviewPayload
    | null {
    const {
        kind,
        asset,
        startDate,
        endDate,
        distributables,
        kpiDistribution,
        fixedDistribution,
        restrictions,
    } = payload;

    if (!kind || !asset || !startDate || !endDate || !distributables)
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

    return new HoldFungibleAssetCampaignPreviewPayload(
        asset,
        chainId,
        startDate,
        endDate,
        distributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface HoldFungibleAssetFormProps {
    unsupportedChain: boolean;
    distributablesType: DistributablesType;
    onStepComplete: (payload: LiquityV2CampaignPayloadPart) => void;
    onLaunch: () => void;
}

export function HoldFungibleAssetForm({
    // unsupportedChain,
    distributablesType,
    onStepComplete,
    onLaunch,
}: HoldFungibleAssetFormProps) {
    const [payload, setPayload] = useState<HoldFungibleAssetCampaignPayload>({
        kind: CampaignKind.HoldFungibleAsset,
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
        () => [FormStepId.Basics, FormStepId.Rewards, FormStepId.Launch],
        [],
    );

    const handleOnApply = useCallback(
        (part: HoldFungibleAssetCampaignPayloadPart, stepId: FormStepId) => {
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
        [activeStepId, payload, steps, onStepComplete, updateActiveStepId],
    );

    const unsavedSteps = Object.values(unsaved).some((item) => !!item);

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <HoldFungibleAssetBasicsStep
                    payload={payload}
                    onApply={handleOnApply}
                />
                <HoldFungibleAssetRewardsStep
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(
                            payload,
                            HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS,
                        )
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
