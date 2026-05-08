import { CampaignRewardsStep } from "../../steps/campaign-rewards-step";
import { useMemo, useState } from "react";
import {
    distributablesCompleted,
    distributablesEqual,
    fixedDistributionsEqual,
    getCampaignFormApr,
    restrictionsEqual,
} from "@/src/utils/form";
import { DistributablesType, RestrictionType } from "@metrom-xyz/sdk";
import { useFormSteps } from "@/src/context/form-steps";
import type { Address } from "viem";
import type { FormStepId } from "@/src/types/form";
import {
    getErc4626VaultTargetValue,
    type Erc4626VaultCampaignPayload,
    type Erc4626VaultCampaignPayloadPart,
} from "@/src/types/campaign/erc4626-vault-campaign";

interface Erc4626RewardsStepProps {
    payload: Erc4626VaultCampaignPayload;
    disabled?: boolean;
    onApply: (
        payload: Erc4626VaultCampaignPayloadPart,
        stepId: FormStepId,
    ) => void;
}

export function Erc4626VaultRewardsStep({
    payload,
    disabled,
    onApply,
}: Erc4626RewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
        fixedDistribition: payload.fixedDistribution,
        restrictions: {
            type: RestrictionType.Blacklist,
            list: [] as Address[],
        },
    });

    const { errors } = useFormSteps();

    const unsavedChanges = useMemo(() => {
        if (
            !distributablesCompleted(rewardsPayload) &&
            distributablesCompleted(payload)
        )
            return true;

        return (
            !distributablesEqual(payload, rewardsPayload) ||
            !fixedDistributionsEqual(payload, rewardsPayload) ||
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
        getErc4626VaultTargetValue(payload),
    );

    const applyDisabled =
        !!errors.rewards ||
        !unsavedChanges ||
        !distributablesCompleted(rewardsPayload);

    const completed =
        !errors.rewards &&
        !unsavedChanges &&
        distributablesCompleted(rewardsPayload);

    function handlePayloadOnChange(part: Erc4626VaultCampaignPayloadPart) {
        setRewardsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignRewardsStep
            chainId={payload.chainId}
            startDate={payload.startDate}
            endDate={payload.endDate}
            kpiDistribution={payload.kpiDistribution}
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
