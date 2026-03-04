import { CampaignRewardsStep } from "../../steps/campaign-rewards-step";
import { useMemo, useState } from "react";
import {
    distributablesCompleted,
    distributablesEqual,
    getCampaignApr,
    weightingEqual,
} from "@/src/utils/form";
import {
    getAmmPoolLiquidityTargetValue,
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { DistributablesType } from "@metrom-xyz/sdk";
import type { CompletedRequiredSteps } from "..";
import { StepSection } from "../step-section";
import { useTranslations } from "next-intl";
import { WeightingInputs } from "../../inputs/weighting-inputs";
import { useFormErrors } from "@/src/context/form-errors";

interface AmmPoolLiquidityRewardsStepProps {
    payload: AmmPoolLiquidityCampaignPayload;
    disabled?: boolean;
    onComplete: (steps: Partial<CompletedRequiredSteps>) => void;
    onApply: (payload: AmmPoolLiquidityCampaignPayloadPart) => void;
}

export function AmmPoolLiquidityRewardsStep({
    payload,
    disabled,
    onComplete,
    onApply,
}: AmmPoolLiquidityRewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
        weighting: payload.weighting,
    });

    const t = useTranslations("newCampaign.form.ammPoolLiquidity");
    const { errors } = useFormErrors();

    function handlePayloadOnChange(part: AmmPoolLiquidityCampaignPayloadPart) {
        setRewardsPayload((prev) => ({ ...prev, ...part }));
    }

    const unsavedChanges = useMemo(() => {
        if (
            !distributablesCompleted(rewardsPayload) &&
            !rewardsPayload.weighting &&
            distributablesCompleted(payload) &&
            !!payload.weighting
        )
            return true;

        return (
            !distributablesEqual(payload, rewardsPayload) ||
            !weightingEqual(payload, rewardsPayload)
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
    const apr = getCampaignApr(
        payloadForApr,
        getAmmPoolLiquidityTargetValue(payload),
    );

    const applyDisabled =
        !!errors.rewards ||
        !unsavedChanges ||
        !distributablesCompleted(rewardsPayload);

    const completed =
        !errors.rewards &&
        !unsavedChanges &&
        distributablesCompleted(rewardsPayload);

    return (
        <CampaignRewardsStep
            chainId={payload.chainId}
            startDate={payload.startDate}
            endDate={payload.endDate}
            payload={rewardsPayload}
            apr={apr}
            applyDisabled={applyDisabled}
            completed={!!completed}
            disabled={disabled}
            unsavedChanges={unsavedChanges}
            onChange={handlePayloadOnChange}
            onComplete={onComplete}
            onApply={onApply}
            additionalSection={
                <StepSection
                    title={t("weighting.title")}
                    description={t("weighting.description", {
                        token0: payload.pool?.tokens[0].symbol || "",
                        token1: payload.pool?.tokens[1].symbol || "",
                    })}
                >
                    <WeightingInputs
                        pool={payload.pool}
                        value={rewardsPayload.weighting}
                        onChange={handlePayloadOnChange}
                    />
                </StepSection>
            }
        />
    );
}
