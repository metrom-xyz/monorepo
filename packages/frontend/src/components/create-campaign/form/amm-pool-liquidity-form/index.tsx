import {
    type AmmPoolLiquidityCampaignPayload,
    type CampaignPayloadErrors,
    type CampaignPreviewPointDistributables,
    type CampaignPreviewTokenDistributables,
    AmmPoolLiquidityCampaignPreviewPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
    RewardType,
} from "@/src/types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { DistributablesType, SupportedAmm } from "@metrom-xyz/sdk";
import { PoolStep } from "../../steps/pool-step";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { KpiStep } from "../../steps/kpi-step";
import { AMM_SUPPORTS_RANGE_INCENTIVES } from "@/src/commons";
import { RangeStep } from "../../steps/range-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { DexStep } from "../../steps/dex-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

function validatePayload(
    payload: AmmPoolLiquidityCampaignPayload,
): AmmPoolLiquidityCampaignPreviewPayload | null {
    const {
        dex,
        pool,
        startDate,
        endDate,
        points,
        tokens,
        kpiSpecification,
        priceRangeSpecification,
        restrictions,
        fee,
    } = payload;

    if (!dex || !pool || !startDate || !endDate) return null;

    // TODO: add distributables directly the base campaign state?
    let distributables;
    if (points && fee) {
        distributables = {
            type: DistributablesType.Points,
            fee: fee,
            points: points,
        } as CampaignPreviewPointDistributables;
    } else if (tokens && tokens.length > 0) {
        distributables = {
            type: DistributablesType.Tokens,
            tokens: tokens,
        } as CampaignPreviewTokenDistributables;
    } else return null;

    return new AmmPoolLiquidityCampaignPreviewPayload(
        dex,
        pool,
        priceRangeSpecification,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    );
}

interface AmmPoolLiquidityFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (
        payload: AmmPoolLiquidityCampaignPreviewPayload | null,
    ) => void;
}

export function AmmPoolLiquidityForm({
    unsupportedChain,
    onPreviewClick,
}: AmmPoolLiquidityFormProps) {
    const t = useTranslations("newCampaign");
    const chainId = useChainId();

    const [payload, setPayload] = useState<AmmPoolLiquidityCampaignPayload>({});
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(payload);
    }, [payload, errors]);

    useEffect(() => {
        setPayload({});
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
                    dex={payload?.dex}
                    onDexChange={handlePayloadOnChange}
                />
                <PoolStep
                    disabled={!payload?.dex || unsupportedChain}
                    dex={payload?.dex}
                    pool={payload?.pool}
                    onPoolChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <StartDateStep
                    disabled={!payload?.pool || unsupportedChain}
                    startDate={payload?.startDate}
                    endDate={payload?.endDate}
                    onStartDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <EndDateStep
                    disabled={!payload?.startDate || unsupportedChain}
                    startDate={payload?.startDate}
                    endDate={payload?.endDate}
                    onEndDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <RewardsStep
                    disabled={!payload?.endDate || unsupportedChain}
                    rewardType={payload?.rewardType}
                    tokens={payload?.tokens}
                    points={payload?.points}
                    fee={payload?.fee}
                    startDate={payload?.startDate}
                    endDate={payload?.endDate}
                    onRewardsChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <KpiStep
                    disabled={
                        !payload?.tokens ||
                        payload.rewardType === RewardType.Points ||
                        unsupportedChain
                    }
                    pool={payload?.pool}
                    rewards={payload?.tokens}
                    rewardType={payload.rewardType}
                    kpiSpecification={payload?.kpiSpecification}
                    onKpiChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                {payload?.pool &&
                    AMM_SUPPORTS_RANGE_INCENTIVES[
                        payload?.pool.amm as SupportedAmm
                    ] && (
                        <RangeStep
                            disabled={!payload?.tokens || unsupportedChain}
                            rewardType={payload.rewardType}
                            pool={payload.pool}
                            priceRangeSpecification={
                                payload?.priceRangeSpecification
                            }
                            onRangeChange={handlePayloadOnChange}
                            onError={handlePayloadOnError}
                        />
                    )}
                <RestrictionsStep
                    disabled={
                        (!payload?.tokens && !payload.points) ||
                        unsupportedChain
                    }
                    restrictions={payload?.restrictions}
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
