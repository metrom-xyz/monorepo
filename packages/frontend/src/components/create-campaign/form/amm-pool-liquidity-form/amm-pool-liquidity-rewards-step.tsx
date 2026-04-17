import { CampaignRewardsStep } from "../../steps/campaign-rewards-step";
import { useMemo, useState } from "react";
import {
    distributablesCompleted,
    distributablesEqual,
    getCampaignFormApr,
    restrictionsEqual,
    weightingEqual,
} from "@/src/utils/form";
import {
    getAmmPoolLiquidityTargetValue,
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import {
    AmmPoolLiquidityType,
    DistributablesType,
    RestrictionType,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { StepSection } from "../step-section";
import { useTranslations } from "next-intl";
import { WeightingInputs } from "../../inputs/weighting-inputs";
import { useFormSteps } from "@/src/context/form-steps";
import type { Address } from "viem";
import { InfoMessage } from "@/src/components/info-message";
import { AMM_SUPPORTS_TOKENS_RATIO } from "@/src/commons";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import type { FormStepId } from "@/src/types/form";

interface AmmPoolLiquidityRewardsStepProps {
    payload: AmmPoolLiquidityCampaignPayload;
    disabled?: boolean;
    onApply: (
        payload: AmmPoolLiquidityCampaignPayloadPart,
        stepId: FormStepId,
    ) => void;
}

export function AmmPoolLiquidityRewardsStep({
    payload,
    disabled,
    onApply,
}: AmmPoolLiquidityRewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
        weighting: payload.weighting,
        restrictions: {
            type: RestrictionType.Blacklist,
            list: [] as Address[],
        },
    });

    const t = useTranslations("newCampaign.form.ammPoolLiquidity");
    const { id: chainId } = useChainWithType();
    const { errors } = useFormSteps();

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
            !weightingEqual(payload, rewardsPayload) ||
            !restrictionsEqual(payload, rewardsPayload)
        );
    }, [payload, rewardsPayload]);

    const tokensRatioSupported = useMemo(() => {
        return (
            !!payload.pool &&
            AMM_SUPPORTS_TOKENS_RATIO[payload.pool.amm as SupportedAmm] &&
            payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
        );
    }, [payload.pool]);

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

    function handlePayloadOnChange(part: AmmPoolLiquidityCampaignPayloadPart) {
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
            onChange={handlePayloadOnChange}
            onApply={onApply}
            additionalSection={
                tokensRatioSupported && (
                    <StepSection
                        title={t("weighting.title")}
                        description={
                            <InfoMessage
                                weight="regular"
                                text={t("weighting.description", {
                                    token0:
                                        payload.pool?.tokens[0].symbol || "",
                                    token1:
                                        payload.pool?.tokens[1].symbol || "",
                                })}
                                link="https://docs.metrom.xyz/creating-a-campaign/reward-ratio"
                            />
                        }
                    >
                        <WeightingInputs
                            pool={payload.pool}
                            value={rewardsPayload.weighting}
                            onChange={handlePayloadOnChange}
                        />
                    </StepSection>
                )
            }
        />
    );
}
