import {
    type CampaignPayloadErrors,
    LiquityV2CampaignPreviewPayload,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
    type CampaignPreviewDistributables,
    EmptyTargetCampaignPreviewPayload,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { LiquityV2BrandStep } from "../../steps/liquity-v2-brand-step";
import { LiquityV2CollateralStep } from "../../steps/liquity-v2-collateral-step";
import { KpiStep } from "../../steps/kpi-step";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import {
    CampaignKindStep,
    type CampaignKindOption,
} from "../../steps/campaign-kind-step";
import { validateDistributables } from "@/src/utils/creation-form";
import type { TranslationsKeys } from "@/src/types/utils";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: LiquityV2CampaignPayload,
): LiquityV2CampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        kind,
        brand,
        collateral,
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
        !startDate ||
        !endDate ||
        !distributables
    )
        return null;

    if (!validateDistributables(distributables)) return null;

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

    return new LiquityV2CampaignPreviewPayload(
        kind,
        brand,
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
    onPreviewClick: (
        payload:
            | LiquityV2CampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

const LIQUITY_V2_CAMPAIGN_KIND_OPTIONS: CampaignKindOption<
    TranslationsKeys<"newCampaign">
>[] = [
    {
        label: "form.liquityV2.actions.borrow",
        value: CampaignKind.LiquityV2Debt,
    },
    {
        label: "form.liquityV2.actions.depositToStabilityPool",
        value: CampaignKind.LiquityV2StabilityPool,
    },
] as const;

const initialPayload: LiquityV2CampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function LiquityV2ForksForm({
    unsupportedChain,
    onPreviewClick,
}: LiquityV2ForksFormProps) {
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
            payload.distributables.type === DistributablesType.FixedPoints ||
            payload.distributables.type === DistributablesType.DynamicPoints ||
            payload.distributables.type ===
                DistributablesType.NoDistributables ||
            !payload.distributables.tokens ||
            payload.distributables.tokens.length === 0
        );
    }, [payload.distributables]);

    const missingDistributables = useMemo(() => {
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

    const kindOptions = useMemo(() => {
        return LIQUITY_V2_CAMPAIGN_KIND_OPTIONS.map((option) => ({
            ...option,
            label: t(option.label, {
                debtToken: payload.brand?.debtToken.symbol || "",
            }),
        }));
    }, [payload.brand?.debtToken.symbol, t]);

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
                <CampaignKindStep
                    disabled={!payload.brand || unsupportedChain}
                    kinds={kindOptions}
                    kind={payload.kind}
                    onKindChange={handlePayloadOnChange}
                />
                <LiquityV2CollateralStep
                    disabled={!payload.kind || unsupportedChain}
                    brand={payload.brand}
                    kind={payload.kind}
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
                    usdTvl={
                        payload.kind === CampaignKind.LiquityV2Debt
                            ? payload.collateral?.usdMintedDebt
                            : payload.kind ===
                                CampaignKind.LiquityV2StabilityPool
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
                onClick={handlePreviewOnClick}
                className={{ root: styles.button }}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
