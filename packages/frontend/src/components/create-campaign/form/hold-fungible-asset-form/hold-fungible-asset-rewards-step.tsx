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
import { useChainWithType } from "@/src/hooks/useChainWithType";
import type { Address } from "viem";
import type { FormStepId } from "@/src/types/form";
import {
    getHoldFungibleAssetTargetValue,
    type HoldFungibleAssetCampaignPayload,
    type HoldFungibleAssetCampaignPayloadPart,
} from "@/src/types/campaign/hold-fungible-asset-campaign";

interface HoldFungibleAssetRewardsStepProps {
    payload: HoldFungibleAssetCampaignPayload;
    disabled?: boolean;
    onApply: (
        payload: HoldFungibleAssetCampaignPayloadPart,
        stepId: FormStepId,
    ) => void;
}

export function HoldFungibleAssetRewardsStep({
    payload,
    disabled,
    onApply,
}: HoldFungibleAssetRewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
        fixedDistribition: payload.fixedDistribution,
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
        getHoldFungibleAssetTargetValue(payload),
    );

    const applyDisabled =
        !!errors.rewards ||
        !unsavedChanges ||
        !distributablesCompleted(rewardsPayload);

    const completed =
        !errors.rewards &&
        !unsavedChanges &&
        distributablesCompleted(rewardsPayload);

    function handlePayloadOnChange(part: HoldFungibleAssetCampaignPayloadPart) {
        setRewardsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignRewardsStep
            chainId={chainId}
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
