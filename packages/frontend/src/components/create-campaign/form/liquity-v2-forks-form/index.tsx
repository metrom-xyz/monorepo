import {
    type CampaignPayloadErrors,
    type CampaignPreviewPointDistributables,
    type CampaignPreviewTokenDistributables,
    LiquityV2CampaignPreviewPayload,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
} from "@/src/types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { DistributablesType } from "@metrom-xyz/sdk";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { LiquityV2BrandStep } from "../../steps/liquity-v2-brand-step";
import { LiquityV2ActionStep } from "../../steps/liquity-v2-action-step";
import { LiquityV2CollateralsStep } from "../../steps/liquity-v2-collaterals-step";
import { LIQUITY_V2_CAMPAIGN_COLLATERALS } from "@/src/commons/env";

import styles from "./styles.module.css";

function validatePayload(
    payload: LiquityV2CampaignPayload,
): LiquityV2CampaignPreviewPayload | null {
    const {
        brand,
        action,
        filters,
        supportedCollaterals,
        startDate,
        endDate,
        points,
        tokens,
        kpiSpecification,
        restrictions,
        fee,
    } = payload;

    // TODO: handle collaterals
    if (!brand || !action || !startDate || !endDate || !supportedCollaterals)
        return null;

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

    return new LiquityV2CampaignPreviewPayload(
        brand,
        action,
        filters || [],
        supportedCollaterals,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    );
}

interface LiquityV2ForksFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (payload: LiquityV2CampaignPreviewPayload | null) => void;
}

export function LiquityV2ForksForm({
    unsupportedChain,
    onPreviewClick,
}: LiquityV2ForksFormProps) {
    const t = useTranslations("newCampaign");
    const chainId = useChainId();

    const [payload, setPayload] = useState<LiquityV2CampaignPayload>({});
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(payload);
    }, [payload, errors]);

    useEffect(() => {
        setPayload({});
    }, [chainId]);

    function handlePayloadOnChange(part: LiquityV2CampaignPayloadPart) {
        setPayload((prev) => ({ ...prev, ...part }));
    }

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
                <LiquityV2BrandStep
                    disabled={unsupportedChain}
                    brand={payload.brand}
                    supportedCollaterals={payload.supportedCollaterals}
                    onBrandChange={handlePayloadOnChange}
                    onSupportedCollateralsChange={handlePayloadOnChange}
                />
                <LiquityV2ActionStep
                    disabled={!payload?.brand || unsupportedChain}
                    action={payload.action}
                    onActionChange={handlePayloadOnChange}
                />
                {LIQUITY_V2_CAMPAIGN_COLLATERALS && (
                    <LiquityV2CollateralsStep
                        disabled={!payload?.action || unsupportedChain}
                        collaterals={payload.filters}
                        supportedCollaterals={payload.supportedCollaterals}
                        onCollateralsChange={handlePayloadOnChange}
                    />
                )}
                <StartDateStep
                    disabled={!payload?.action || unsupportedChain}
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
                {/* TODO: add support for KPIs to liquity campaign, how? */}
                {/* <KpiStep
                    disabled={
                        !payload?.tokens ||
                        payload.rewardType === RewardType.Points ||
                        unsupportedChain
                    }
                    pool={payload?.pool}
                    rewards={payload?.tokens}
                    kpiSpecification={payload?.kpiSpecification}
                    onKpiChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                /> */}
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
