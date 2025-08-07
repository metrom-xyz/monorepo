import {
    type CampaignPayloadErrors,
    LiquityV2CampaignPreviewPayload,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
    type CampaignPreviewDistributables,
} from "@/src/types/campaign";
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
import { LiquityV2CollateralStep } from "../../steps/liquity-v2-collateral-step";
import { LiquityV2Action } from "@/src/types/common";
import { KpiStep } from "../../steps/kpi-step";

import styles from "./styles.module.css";

function validatePayload(
    payload: LiquityV2CampaignPayload,
): LiquityV2CampaignPreviewPayload | null {
    const {
        brand,
        action,
        collateral,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    } = payload;

    if (
        !brand ||
        !collateral ||
        !action ||
        !startDate ||
        !endDate ||
        !distributables
    )
        return null;

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

    return new LiquityV2CampaignPreviewPayload(
        brand,
        action,
        collateral,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface LiquityV2ForksFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (payload: LiquityV2CampaignPreviewPayload | null) => void;
}

const initialPayload: LiquityV2CampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function LiquityV2ForksForm({
    unsupportedChain,
    onPreviewClick,
}: LiquityV2ForksFormProps) {
    const t = useTranslations("newCampaign");
    const chainId = useChainId();

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(payload);
    }, [payload, errors]);

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

    useEffect(() => {
        setPayload(initialPayload);
    }, [chainId]);

    const handlePayloadOnChange = useCallback(
        (part: LiquityV2CampaignPayloadPart) => {
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
                <LiquityV2BrandStep
                    disabled={unsupportedChain}
                    brand={payload.brand}
                    onBrandChange={handlePayloadOnChange}
                />
                <LiquityV2ActionStep
                    disabled={!payload.brand || unsupportedChain}
                    action={payload.action}
                    brand={payload.brand}
                    onActionChange={handlePayloadOnChange}
                />
                <LiquityV2CollateralStep
                    disabled={!payload.action || unsupportedChain}
                    brand={payload.brand}
                    action={payload.action}
                    collateral={payload.collateral}
                    onCollateralChange={handlePayloadOnChange}
                />
                <StartDateStep
                    disabled={!payload.collateral || unsupportedChain}
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
                <KpiStep
                    disabled={noDistributables || unsupportedChain}
                    usdTvl={
                        payload.action === LiquityV2Action.Debt
                            ? payload.collateral?.usdMintedDebt
                            : payload.action === LiquityV2Action.StabilityPool
                              ? payload.collateral?.usdStabilityPoolDebt
                              : undefined
                    }
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
