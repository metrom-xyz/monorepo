import { useCallback, useMemo, useState } from "react";
import {
    AmmPoolLiquidityType,
    CampaignKind,
    DistributablesType,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import {
    AmmPoolLiquidityBasicsStep,
    AMM_POOL_LIQUIDITY_BASIC_PAYLOAD_KEYS,
} from "./amm-pool-liquidity-basics-step";
import { AmmPoolLiquidityRewardsStep } from "./amm-pool-liquidity-rewards-step";
import { useFormSteps } from "@/src/context/form-steps";
import { CampaignKpiStep } from "../../steps/campaign-kpi-step";
import { AMM_SUPPORTS_RANGE_INCENTIVES } from "@/src/commons";
import { CampaignPoolRangeStep } from "../../steps/campaign-pool-range-step";
import {
    allFieldsFilled,
    distributablesCompleted,
    validateDistributables,
    validateDistributions,
    validatePriceRangeSpecification,
} from "@/src/utils/form";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";
import { FormStepId } from "@/src/types/form";
import type {
    CampaignPreviewFixedDistribution,
    CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: AmmPoolLiquidityCampaignPayload,
):
    | AmmPoolLiquidityCampaignPreviewPayload
    | EmptyTargetCampaignPreviewPayload
    | null {
    const {
        kind,
        dex,
        pool,
        startDate,
        endDate,
        distributables,
        weighting,
        kpiDistribution,
        fixedDistribution,
        priceRangeSpecification,
        restrictions,
    } = payload;

    if (!kind || !dex || !pool || !startDate || !endDate || !distributables)
        return null;
    if (!validateDistributables(distributables)) return null;
    if (!validateDistributions(kpiDistribution, fixedDistribution)) return null;
    if (
        priceRangeSpecification &&
        !validatePriceRangeSpecification(priceRangeSpecification)
    )
        return null;

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

    return new AmmPoolLiquidityCampaignPreviewPayload(
        kind,
        dex,
        pool,
        weighting,
        priceRangeSpecification,
        chainId,
        startDate,
        endDate,
        distributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface AmmPoolLiquidityFormProps {
    kind: CampaignKind;
    distributablesType: DistributablesType;
    onStepComplete: (payload: AmmPoolLiquidityCampaignPayloadPart) => void;
    onLaunch: () => void;
}

export function AmmPoolLiquidityForm({
    kind,
    distributablesType,
    onStepComplete,
    onLaunch,
}: AmmPoolLiquidityFormProps) {
    const [payload, setPayload] = useState<AmmPoolLiquidityCampaignPayload>({
        kind,
        distributables: { type: distributablesType },
        weighting: { liquidity: 100, token0: 0, token1: 0 },
    });

    const { errors, unsaved, activeStepId, updateActiveStepId } =
        useFormSteps();

    const validatedPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error) || !payload.chainId)
            return null;
        return validatePayload(payload.chainId, payload);
    }, [payload, errors]);

    const rangeSupported = useMemo(() => {
        return (
            !!payload.pool &&
            AMM_SUPPORTS_RANGE_INCENTIVES[payload.pool.amm as SupportedAmm] &&
            payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
        );
    }, [payload.pool]);

    const steps: FormStepId[] = useMemo(
        () => [
            FormStepId.Basics,
            FormStepId.Rewards,
            FormStepId.Kpi,
            ...(rangeSupported ? [FormStepId.PoolRange] : []),
            FormStepId.Launch,
        ],
        [rangeSupported],
    );

    const handleOnApply = useCallback(
        (part: AmmPoolLiquidityCampaignPayloadPart, stepId: FormStepId) => {
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
                <AmmPoolLiquidityBasicsStep
                    payload={payload}
                    onApply={handleOnApply}
                />
                <AmmPoolLiquidityRewardsStep
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(
                            payload,
                            AMM_POOL_LIQUIDITY_BASIC_PAYLOAD_KEYS,
                        )
                    }
                    onApply={handleOnApply}
                />
                <CampaignKpiStep
                    payload={payload}
                    targetUsdValue={payload.pool?.usdTvl}
                    disabled={
                        !!errors.rewards || !distributablesCompleted(payload)
                    }
                    onApply={handleOnApply}
                />
                {rangeSupported && (
                    <CampaignPoolRangeStep
                        payload={payload}
                        disabled={
                            !!errors.rewards ||
                            !distributablesCompleted(payload)
                        }
                        onApply={handleOnApply}
                    />
                )}
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
