import {
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
} from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import {
    BaseCampaignType,
    CampaignKind,
    DistributablesType,
} from "@metrom-xyz/sdk";
import { Button, Typography } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { validateDistributables } from "@/src/utils/creation-form";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { StepSection } from "../step-section";
import { ChainSelect } from "../../inputs/chain-select";
import { DexSelect } from "../../inputs/dex-select";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    type AmmPoolLiquidityCampaignPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import { PoolSelect } from "../../inputs/pool-select";

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
        kpiSpecification,
        priceRangeSpecification,
        restrictions,
    } = payload;

    if (!kind || !dex || !pool || !startDate || !endDate || !distributables)
        return null;
    if (!validateDistributables(distributables)) return null;

    // TODO: handle chain type for same chain ids?
    if (EXPERIMENTAL_CHAINS.includes(chainId)) {
        return new EmptyTargetCampaignPreviewPayload(
            chainId,
            startDate,
            endDate,
            distributables as CampaignPreviewDistributables,
            kpiSpecification,
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
        kpiSpecification,
        restrictions,
    );
}

interface AmmPoolLiquidityFormProps {
    kind: CampaignKind;
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
    kind,
    // unsupportedChain,
    onPreviewClick,
}: AmmPoolLiquidityFormProps) {
    const t = useTranslations("newCampaign");
    const { id: chainId } = useChainWithType();

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
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
        setPayload({ ...initialPayload, kind });
    }, [chainId, kind]);

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
                <CampaignBasicsStep
                    startDatePickerDisabled={!payload.pool}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onError={handlePayloadOnError}
                    onChange={handlePayloadOnChange}
                    targetSection={
                        <StepSection
                            title={
                                <Typography weight="semibold">
                                    {t("defineTarget")}
                                </Typography>
                            }
                        >
                            <div className={styles.target}>
                                <ChainSelect
                                    campaignType={
                                        BaseCampaignType.AmmPoolLiquidity
                                    }
                                    value={payload.chainId}
                                    onChange={handlePayloadOnChange}
                                />
                                <DexSelect
                                    chainId={payload.chainId}
                                    value={payload.dex}
                                    resetTrigger={payload.chainId}
                                    onChange={handlePayloadOnChange}
                                />
                                <PoolSelect
                                    chainId={payload.chainId}
                                    dex={payload.dex?.slug}
                                    value={payload.pool}
                                    resetTrigger={payload.dex}
                                    onChange={handlePayloadOnChange}
                                />
                            </div>
                        </StepSection>
                    }
                />
                {/* <RewardsStep
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
                /> */}
            </div>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={!previewPayload}
                onClick={handlePreviewOnClick}
                className={{ root: styles.button }}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
