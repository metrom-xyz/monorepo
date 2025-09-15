import {
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
    EmptyTargetCampaignPreviewPayload,
    type AaveV3CampaignPayload,
    AaveV3CampaignPreviewPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { DistributablesType } from "@metrom-xyz/sdk";
import { AaveV3CollateralStep } from "../../steps/aave-v3-collateral-step";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { AaveV3BrandStep } from "../../steps/aave-v3-brand-step";
import { AaveV3ActionStep } from "../../steps/aave-v3-action-step";
import { AaveV3MarketStep } from "../../steps/aave-v3-market-step";
import { KpiStep } from "../../steps/kpi-step";

import styles from "./styles.module.css";
import { AaveV3Action } from "@/src/types/common";

function validatePayload(
    chainId: number,
    payload: AaveV3CampaignPayload,
): AaveV3CampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        brand,
        action,
        market,
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
        !market ||
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
        brand,
        action,
        market,
        collateral,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface AaveV3FormProps {
    unsupportedChain: boolean;
    onPreviewClick: (
        payload:
            | AaveV3CampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

const initialPayload: AaveV3CampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function AaveV3Form({
    unsupportedChain,
    onPreviewClick,
}: AaveV3FormProps) {
    const t = useTranslations("newCampaign");
    const { id: chainId } = useChainWithType();

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(chainId, payload);
    }, [chainId, payload, errors]);

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
                <AaveV3ActionStep
                    disabled={!payload.brand || unsupportedChain}
                    action={payload.action}
                    onActionChange={handlePayloadOnChange}
                />
                <AaveV3CollateralStep
                    disabled={!payload.action || unsupportedChain}
                    brand={payload.brand}
                    action={payload.action}
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
                {payload.action &&
                    payload.action !== AaveV3Action.BridgeAndSupply && (
                        <KpiStep
                            disabled={noDistributables || unsupportedChain}
                            usdTvl={
                                payload.action === AaveV3Action.Borrow
                                    ? payload.collateral?.usdDebt
                                    : payload.collateral?.usdSupply
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
