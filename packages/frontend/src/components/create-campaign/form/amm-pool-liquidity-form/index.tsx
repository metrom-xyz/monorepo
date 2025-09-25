import {
    type AmmPoolLiquidityCampaignPayload,
    type CampaignPayloadErrors,
    AmmPoolLiquidityCampaignPreviewPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
    type CampaignPreviewDistributables,
    EmptyTargetCampaignPreviewPayload,
    CampaignKind,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import {
    AmmPoolLiquidityType,
    DistributablesType,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { PoolStep } from "../../steps/pool-step";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { KpiStep } from "../../steps/kpi-step";
import { RangeStep } from "../../steps/range-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { DexStep } from "../../steps/dex-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import {
    AMM_SUPPORTS_RANGE_INCENTIVES,
    AMM_SUPPORTS_TOKENS_RATIO,
} from "@/src/commons";
import { WeightingStep } from "../../steps/weighting";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: AmmPoolLiquidityCampaignPayload,
    campaignKind: CampaignKind,
):
    | AmmPoolLiquidityCampaignPreviewPayload
    | EmptyTargetCampaignPreviewPayload
    | null {
    const {
        dex,
        pool,
        startDate,
        endDate,
        distributables,
        weighting,
        kpiSpecification,
        priceRangeSpecification,
        restrictions,
    } = payload;

    if (!dex || !pool || !startDate || !endDate || !distributables) return null;

    if (
        distributables.type === DistributablesType.Points &&
        (!distributables.fee || !distributables.type)
    )
        return null;
    if (
        distributables.type === DistributablesType.Tokens &&
        (!distributables.tokens || distributables.tokens.length === 0)
    )
        return null;

    // TODO: handle chain type for same chain ids?
    if (EXPERIMENTAL_CHAINS.includes(chainId)) {
        return new EmptyTargetCampaignPreviewPayload(
            startDate,
            endDate,
            distributables as CampaignPreviewDistributables,
            kpiSpecification,
            restrictions,
        );
    }

    return new AmmPoolLiquidityCampaignPreviewPayload(
        campaignKind,
        dex,
        pool,
        weighting,
        priceRangeSpecification,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface AmmPoolLiquidityFormProps {
    campaignKind: CampaignKind;
    unsupportedChain: boolean;
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
    campaignKind,
    unsupportedChain,
    onPreviewClick,
}: AmmPoolLiquidityFormProps) {
    const t = useTranslations("newCampaign");
    const { id: chainId } = useChainWithType();

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(chainId, payload, campaignKind);
    }, [chainId, payload, errors, campaignKind]);

    const noDistributables = useMemo(() => {
        return (
            !payload.distributables ||
            payload.distributables.type === DistributablesType.Points ||
            !payload.distributables.tokens ||
            payload.distributables.tokens.length === 0
        );
    }, [payload.distributables]);

    const missingDistributables = useMemo(() => {
        if (!payload.distributables) return true;

        const { type } = payload.distributables;

        if (type === DistributablesType.Points)
            return (
                !payload.distributables.fee || !payload.distributables.points
            );
        if (type === DistributablesType.Tokens)
            return (
                !payload.distributables.tokens ||
                payload.distributables.tokens.length === 0
            );

        return true;
    }, [payload.distributables]);

    const tokensRatioSupported = useMemo(() => {
        return (
            !!payload.pool &&
            AMM_SUPPORTS_TOKENS_RATIO[payload.pool.amm as SupportedAmm] &&
            payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
        );
    }, [payload.pool]);

    const rangeSupported = useMemo(() => {
        return (
            !!payload.pool &&
            AMM_SUPPORTS_RANGE_INCENTIVES[payload.pool.amm as SupportedAmm] &&
            payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
        );
    }, [payload.pool]);

    useEffect(() => {
        setPayload(initialPayload);
    }, [chainId]);

    const handlePayloadOnChange = useCallback(
        (part: AmmPoolLiquidityCampaignPayloadPart) => {
            setPayload((prev) => ({ ...prev, ...part }));
        },
        [],
    );

    const handlePayloadOnError = useCallback(
        (errors: CampaignPayloadErrors) => {
            setErrors((state) => ({ ...state, ...errors }));
        },
        [],
    );

    function handlePreviewOnClick() {
        onPreviewClick(previewPayload);
    }

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <DexStep
                    disabled={unsupportedChain}
                    dex={payload.dex}
                    onDexChange={handlePayloadOnChange}
                />
                <PoolStep
                    disabled={!payload.dex || unsupportedChain}
                    dex={payload.dex}
                    pool={payload.pool}
                    onPoolChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <StartDateStep
                    disabled={!payload.pool || unsupportedChain}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onStartDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <EndDateStep
                    disabled={!payload.startDate || unsupportedChain}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onEndDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <RewardsStep
                    disabled={!payload.endDate || unsupportedChain}
                    distributables={payload.distributables}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
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
                    usdTvl={payload.pool?.usdTvl}
                    distributables={
                        payload.distributables?.type ===
                        DistributablesType.Tokens
                            ? payload.distributables
                            : undefined
                    }
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    kpiSpecification={payload.kpiSpecification}
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
                />
            </div>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={!previewPayload}
                className={{ root: styles.button }}
                onClick={handlePreviewOnClick}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
