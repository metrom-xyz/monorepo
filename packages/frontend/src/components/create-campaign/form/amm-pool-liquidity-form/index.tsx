import {
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
    type CampaignPreviewFixedDistribution,
    type CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";
import { useEffect, useMemo } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import {
    validateDistributables,
    validateDistributions,
} from "@/src/utils/creation-form";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import { BasicsSteps } from "./basics-step";

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
    payload: AmmPoolLiquidityCampaignPayload;
    errors: CampaignPayloadErrors;
    unsupportedChain: boolean;
    onChange: (payload: AmmPoolLiquidityCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
    onPreviewClick: (
        payload:
            | AmmPoolLiquidityCampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

const initialPayload: AmmPoolLiquidityCampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function AmmPoolLiquidityForm({
    kind,
    payload,
    errors,
    // unsupportedChain,
    onChange,
    onError,
    // onPreviewClick,
}: AmmPoolLiquidityFormProps) {
    const { id: chainId } = useChainWithType();

    useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(chainId, payload);
    }, [chainId, payload, errors]);

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

    // const rangeSupported = useMemo(() => {
    //     return (
    //         !!payload.pool &&
    //         AMM_SUPPORTS_RANGE_INCENTIVES[payload.pool.amm as SupportedAmm] &&
    //         payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
    //     );
    // }, [payload.pool]);

    useEffect(() => {
        onChange({ ...initialPayload, kind });
    }, [chainId, kind, onChange]);

    // useEffect(() => {
    //     onChange(payload);
    // }, [payload, onChange]);

    // const handlePayloadOnChange = useCallback(
    //     (part: AmmPoolLiquidityCampaignPayloadPart) => {
    //         setPayload((prev) => ({ ...prev, ...part }));
    //     },
    //     [],
    // );

    // const handlePayloadOnError = useCallback(
    //     (errors: CampaignPayloadErrors) => {
    //         setErrors((state) => ({ ...state, ...errors }));
    //     },
    //     [],
    // );

    // TODO: should become on launch click
    // function handlePreviewOnClick() {
    //     onPreviewClick(previewPayload);
    // }

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <BasicsSteps
                    payload={payload}
                    error={errors.basics}
                    onApply={onChange}
                    onError={onError}
                />
                {/* <RewardsStep
                    disabled={!payload.endDate || unsupportedChain}
                    distributables={payload.distributables}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    kpiDistribution={payload.kpiDistribution}
                    fixedDistribution={payload.fixedDistribution}
                    onDistributablesChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                {tokensRatioSupported && (
                    <WeightingStep
                        pool={payload.pool}
                        disabled={noDistributables || unsupportedChain}
                        weighting={payload.weighting}
                        onWeightingChange={handlePayloadOnChange}
                        onError={handlePayloadOnError}
                    />
                )}
                <KpiStep
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
                />
                {rangeSupported && (
                    <RangeStep
                        disabled={noDistributables || unsupportedChain}
                        distributablesType={payload.distributables?.type}
                        pool={payload.pool}
                        priceRangeSpecification={
                            payload.priceRangeSpecification
                        }
                        onRangeChange={handlePayloadOnChange}
                        onError={handlePayloadOnError}
                    />
                )}
                <RestrictionsStep
                    disabled={missingDistributables || unsupportedChain}
                    restrictions={payload.restrictions}
                    onRestrictionsChange={handlePayloadOnChange}
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
