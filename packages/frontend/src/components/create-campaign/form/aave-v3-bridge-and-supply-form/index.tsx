import {
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
    AaveV3CampaignPreviewPayload,
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
    EmptyTargetCampaignPreviewPayload,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import { AaveV3CollateralStep } from "../../steps/aave-v3-collateral-step";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { KpiStep } from "../../steps/kpi-step";
import { AaveV3BridgeAndSupplyBoostStep } from "../../steps/aave-v3-bridge-supply-boost";
import { AaveV3MarketStep } from "../../steps/aave-v3-market-step";
import { AaveV3BrandStep } from "../../steps/aave-v3-brand-step";
import { validateDistributables } from "@/src/utils/creation-form";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: AaveV3CampaignPayload,
): AaveV3CampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        kind,
        brand,
        market,
        collateral,
        boostingFactor,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    } = payload;

    if (
        !kind ||
        !brand ||
        !collateral ||
        !boostingFactor ||
        !market ||
        !startDate ||
        !endDate ||
        !distributables
    )
        return null;

    if (!validateDistributables(distributables)) return null;
    if (boostingFactor > 0.05) return null;

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

    return new AaveV3CampaignPreviewPayload(
        kind,
        brand,
        market,
        collateral,
        undefined,
        boostingFactor,
        undefined,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface AaveV3BridgeAndSupplyFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (
        payload:
            | AaveV3CampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

export const DEFAULT_BOOST = 0.01;

const initialPayload: AaveV3CampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
    kind: CampaignKind.AaveV3BridgeAndSupply,
    boostingFactor: DEFAULT_BOOST,
};

export function AaveV3BridgeAndSupplyForm({
    unsupportedChain,
    onPreviewClick,
}: AaveV3BridgeAndSupplyFormProps) {
    const t = useTranslations("newCampaign");
    const { id: chainId } = useChainWithType();

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(chainId, payload);
    }, [chainId, payload, errors]);

    const noDistributables = useMemo(() => {
        if (!payload.distributables) return true;

        const { type } = payload.distributables;

        if (type === DistributablesType.FixedPoints)
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
        (part: AaveV3CampaignPayloadPart) => {
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
                <AaveV3BrandStep
                    disabled={unsupportedChain}
                    brand={payload.brand}
                    onBrandChange={handlePayloadOnChange}
                />
                <AaveV3MarketStep
                    brand={payload.brand}
                    onMarketChange={handlePayloadOnChange}
                />
                <AaveV3CollateralStep
                    disabled={
                        !payload.brand || !payload.market || unsupportedChain
                    }
                    kind={payload.kind}
                    brand={payload.brand}
                    market={payload.market}
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
                    kind={payload.kind}
                    usdTvl={payload.collateral?.usdSupply}
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
                <AaveV3BridgeAndSupplyBoostStep
                    disabled={noDistributables || unsupportedChain}
                    boostingFactor={payload.boostingFactor}
                    onBoostingFactorChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <RestrictionsStep
                    disabled={noDistributables || unsupportedChain}
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
