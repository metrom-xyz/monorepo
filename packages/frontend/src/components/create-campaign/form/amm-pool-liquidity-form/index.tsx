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
    AmmPoolLiquidityBasicsSteps,
    BASIC_PAYLOAD_KEYS,
} from "./amm-pool-liquidity-basics-step";
import { AmmPoolLiquidityRewardsStep } from "./amm-pool-liquidity-rewards-step";
import { useFormValidation } from "@/src/context/form-validation";
import { CampaignKpiStep } from "../../steps/campaign-kpi-step";
import { AMM_SUPPORTS_RANGE_INCENTIVES } from "@/src/commons";
import { CampaignPoolRangeStep } from "../../steps/campaign-pool-range-step";
import {
    allFieldsFilled,
    distributablesCompleted,
    validateDistributables,
    validatePriceRangeSpecification,
} from "@/src/utils/form";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";

import styles from "./styles.module.css";
import { validateDistributions } from "@/src/utils/creation-form";
import type { CampaignPreviewDistributables, CampaignPreviewFixedDistribution, CampaignPreviewKpiDistribution } from "@/src/types/campaign/common";

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
            distributables as CampaignPreviewDistributables,
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
        distributables as CampaignPreviewDistributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface AmmPoolLiquidityFormProps {
    kind: CampaignKind;
    unsupportedChain: boolean;
    distributablesType: DistributablesType;
    onStepComplete: (payload: AmmPoolLiquidityCampaignPayloadPart) => void;
    onLaunch: () => void;
}

export function AmmPoolLiquidityForm({
    kind,
    // unsupportedChain,
    distributablesType,
    onStepComplete,
    onLaunch,
}: AmmPoolLiquidityFormProps) {
    const [payload, setPayload] = useState<AmmPoolLiquidityCampaignPayload>({
        kind,
        distributables: { type: distributablesType },
        weighting: { liquidity: 100, token0: 0, token1: 0 },
    });

    const { errors, unsaved } = useFormValidation();

    const validatedPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error) || !payload.chainId)
            return null;
        return validatePayload(payload.chainId, payload);
    }, [payload, errors]);

    // const noDistributables = useMemo(() => {
    //     return (
    //         !payload.distributables ||
    //         payload.distributables.type === DistributablesType.FixedPoints ||
    //         payload.distributables.type === DistributablesType.DynamicPoints ||
    //         payload.distributables.type ===
    //             DistributablesType.NoDistributables ||
    //         !payload.distributables.tokens ||
    //         payload.distributables.tokens.length === 0
    //     );
    // }, [payload.distributables]);

    // const missingDistributables = useMemo(() => {
    //     if (!payload.distributables) return true;

    //     const { type } = payload.distributables;

    //     if (type === DistributablesType.FixedPoints)
    //         return (
    //             !payload.distributables.fee || !payload.distributables.points
    //         );
    //     if (type === DistributablesType.Tokens)
    //         return (
    //             !payload.distributables.tokens ||
    //             payload.distributables.tokens.length === 0
    //         );

    //     return true;
    // }, [payload.distributables]);

    // const tokensRatioSupported = useMemo(() => {
    //     return (
    //         !!payload.pool &&
    //         AMM_SUPPORTS_TOKENS_RATIO[payload.pool.amm as SupportedAmm] &&
    //         payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
    //     );
    // }, [payload.pool]);

    const rangeSupported = useMemo(() => {
        return (
            !!payload.pool &&
            AMM_SUPPORTS_RANGE_INCENTIVES[payload.pool.amm as SupportedAmm] &&
            payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
        );
    }, [payload.pool]);

    // useEffect(() => {
    //     onChange({ ...initialPayload, kind });
    // }, [chainId, kind, onChange]);

    // useEffect(() => {
    //     onChange(payload);
    // }, [payload, onChange]);

    const handleOnApply = useCallback(
        (part: AmmPoolLiquidityCampaignPayloadPart) => {
            setPayload((prev) => ({ ...prev, ...part }));
            onStepComplete({ ...payload, ...part });
        },
        [payload, onStepComplete],
    );

    const unsavedSteps = Object.values(unsaved).some((item) => !!item);

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <AmmPoolLiquidityBasicsSteps
                    payload={payload}
                    onApply={handleOnApply}
                />
                <AmmPoolLiquidityRewardsStep
                    stepNumber={1}
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(payload, BASIC_PAYLOAD_KEYS)
                    }
                    onApply={handleOnApply}
                />
                <CampaignKpiStep
                    stepNumber={2}
                    // TODO: better way?
                    stepIncrement={rangeSupported ? 1 : 2}
                    payload={payload}
                    disabled={
                        !!errors.rewards || !distributablesCompleted(payload)
                    }
                    onApply={handleOnApply}
                />
                {rangeSupported && (
                    <CampaignPoolRangeStep
                        stepNumber={3}
                        payload={payload}
                        disabled={
                            !!errors.rewards ||
                            !distributablesCompleted(payload)
                        }
                        onApply={handleOnApply}
                    />
                )}
                <CampaignApproveLaunchStep
                    stepNumber={4}
                    payload={validatedPayload}
                    disabled={
                        unsavedSteps ||
                        !validatedPayload ||
                        !!Object.values(errors).some((error) => !!error) ||
                        !distributablesCompleted(payload)
                    }
                    onLaunch={onLaunch}
                />
                {/* <KpiStep
                    disabled={noDistributables || unsupportedChain}
                    kind={payload.kind}
                    usdTvl={payload.pool?.usdTvl}
                    distributables={
                        payload.distributables?.type ===
                        DistributablesType.Tokens
                            ? payload.distributables
                            : undefined
                    }
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    kpiDistribution={payload.kpiDistribution}
                    fixedDistribution={payload.fixedDistribution}
                    onKpiChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                /> */}
            </div>
            {/* <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={!previewPayload}
                onClick={handlePreviewOnClick}
                className={{ root: styles.button }}
            >
                {t("submit.preview")}
            </Button> */}
        </div>
    );
}
