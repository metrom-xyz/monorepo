import { CampaignRewardsStep } from "../../steps/campaign-rewards-step";
import { useMemo, useState } from "react";
import {
    distributablesCompleted,
    distributablesEqual,
    getCampaignFormApr,
    restrictionsEqual,
} from "@/src/utils/form";
import { DistributablesType, RestrictionType } from "@metrom-xyz/sdk";
import { useFormSteps } from "@/src/context/form-steps";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import type { Address } from "viem";
import type { FormStepId } from "@/src/types/form";
import {
    getLiquityV2TargetValue,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types/campaign/liquity-v2-campaign";

interface LiquityV2RewardsStepProps {
    payload: LiquityV2CampaignPayload;
    disabled?: boolean;
    onApply: (
        payload: LiquityV2CampaignPayloadPart,
        stepId: FormStepId,
    ) => void;
}

export function LiquityV2RewardsStep({
    payload,
    disabled,
    onApply,
}: LiquityV2RewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
        restrictions: {
            type: RestrictionType.Blacklist,
            list: [] as Address[],
        },
    });

    const { errors } = useFormSteps();
    const { id: chainId } = useChainWithType();

    const unsavedChanges = useMemo(() => {
        if (
            !distributablesCompleted(rewardsPayload) &&
            distributablesCompleted(payload)
        )
            return true;

        return (
            !distributablesEqual(payload, rewardsPayload) ||
            !restrictionsEqual(payload, rewardsPayload)
        );
    }, [payload, rewardsPayload]);

    const payloadForApr = {
        ...payload,
        distributables: {
            type:
                rewardsPayload.distributables?.type ||
                DistributablesType.Tokens,
            ...rewardsPayload.distributables,
        },
    };

    const apr = getCampaignFormApr(
        payloadForApr,
        getLiquityV2TargetValue(payload),
    );

    const applyDisabled =
        !!errors.rewards ||
        !unsavedChanges ||
        !distributablesCompleted(rewardsPayload);

    const completed =
        !errors.rewards &&
        !unsavedChanges &&
        distributablesCompleted(rewardsPayload);

    function handlePayloadOnChange(part: LiquityV2CampaignPayloadPart) {
        setRewardsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignRewardsStep
            chainId={chainId}
            startDate={payload.startDate}
            endDate={payload.endDate}
            payload={rewardsPayload}
            apr={apr}
            applyDisabled={applyDisabled}
            completed={!!completed}
            disabled={disabled}
            unsavedChanges={!disabled && unsavedChanges}
            onApply={onApply}
            onChange={handlePayloadOnChange}
        />
    );
}
