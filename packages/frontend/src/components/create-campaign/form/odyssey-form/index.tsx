import {
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
    EmptyTargetCampaignPreviewPayload,
    type OdysseyCampaignPayload,
    OdysseyCampaignPreviewPayload,
    type OdysseyCampaignPayloadPart,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { DistributablesType } from "@metrom-xyz/sdk";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { validateDistributables } from "@/src/utils/creation-form";
import { getOdysseyUsdTarget } from "@/src/utils/odyssey";
import { OdysseyBrandStep } from "../../steps/odyssey-brand-step";
import { OdysseyStrategyStep } from "../../steps/odyssey-strategy-step";
import { OdysseyAssetsStep } from "../../steps/odyssey-assets-step";

import styles from "./styles.module.css";
import { KpiStep } from "../../steps/kpi-step";

function validatePayload(
    chainId: number,
    payload: OdysseyCampaignPayload,
): OdysseyCampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        kind,
        brand,
        strategy,
        asset,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    } = payload;

    if (
        !kind ||
        !brand ||
        !strategy ||
        !asset ||
        !startDate ||
        !endDate ||
        !distributables
    )
        return null;

    if (!validateDistributables(distributables)) return null;

    if (EXPERIMENTAL_CHAINS.includes(chainId)) {
        return new EmptyTargetCampaignPreviewPayload(
            startDate,
            endDate,
            distributables as CampaignPreviewDistributables,
            kpiSpecification,
            restrictions,
        );
    }

    return new OdysseyCampaignPreviewPayload(
        brand,
        strategy,
        asset,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface OdysseyFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (
        payload:
            | OdysseyCampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

const initialPayload: OdysseyCampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function OdysseyForm({
    unsupportedChain,
    onPreviewClick,
}: OdysseyFormProps) {
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
        (part: OdysseyCampaignPayloadPart) => {
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

    const usdTvl = getOdysseyUsdTarget({
        asset: payload.asset,
        strategy: payload.strategy?.id,
    });

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <OdysseyBrandStep
                    disabled={unsupportedChain}
                    brand={payload.brand}
                    onBrandChange={handlePayloadOnChange}
                />
                <OdysseyStrategyStep
                    disabled={!payload.brand || unsupportedChain}
                    strategy={payload.strategy}
                    onStrategyChange={handlePayloadOnChange}
                />
                <OdysseyAssetsStep
                    disabled={!payload.strategy || unsupportedChain}
                    brand={payload.brand}
                    strategy={payload.strategy}
                    asset={payload.asset}
                    onAssetChange={handlePayloadOnChange}
                />
                <StartDateStep
                    disabled={!payload.asset || unsupportedChain}
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
                    usdTvl={usdTvl}
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
                onClick={handlePreviewOnClick}
                className={{ root: styles.button }}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
