import {
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
    type CampaignPreviewFixedDistribution,
    type CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";
import { CampaignKind, SupportedAaveV3 } from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { type CampaignKindOption } from "../../steps/campaign-kind-step";
import type { TranslationsKeys } from "@/src/types/utils";
import {
    validateDistributables,
    validateDistributions,
} from "@/src/utils/creation-form";
import {
    AaveV3CampaignPreviewPayload,
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/aave-v3-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import { BasicsSteps } from "./basics-step";
import { useAaveV3CollateralUsdNetSupply } from "@/src/hooks/useAaveV3CollateralUsdNetSupply";
import { useMemo } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: AaveV3CampaignPayload,
    usdNetSupply?: number,
): AaveV3CampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        kind,
        brand,
        market,
        collateral,
        startDate,
        endDate,
        distributables,
        kpiDistribution,
        fixedDistribution,
        blacklistedCollaterals,
        restrictions,
    } = payload;

    if (
        !kind ||
        !brand ||
        !collateral ||
        !market ||
        !startDate ||
        !endDate ||
        !distributables ||
        (kind === CampaignKind.AaveV3NetSupply && usdNetSupply === undefined)
    )
        return null;

    if (!validateDistributables(distributables)) return null;
    if (!validateDistributions(kpiDistribution, fixedDistribution)) return null;
    if (
        kind !== CampaignKind.AaveV3NetSupply &&
        blacklistedCollaterals &&
        blacklistedCollaterals.length > 0
    )
        return null;

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

    return new AaveV3CampaignPreviewPayload(
        kind,
        brand,
        market,
        collateral,
        usdNetSupply,
        undefined,
        blacklistedCollaterals,
        chainId,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface AaveV3FormProps {
    payload: AaveV3CampaignPayload;
    errors: CampaignPayloadErrors;
    unsupportedChain: boolean;
    onChange: (payload: AaveV3CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
    onPreviewClick: (
        payload:
            | AaveV3CampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

export const AAVE_V3_CAMPAIGN_KIND_OPTIONS: CampaignKindOption<
    TranslationsKeys<"newCampaign">
>[] = [
    {
        label: "form.aaveV3.actions.borrow",
        value: CampaignKind.AaveV3Borrow,
    },
    {
        label: "form.aaveV3.actions.supply",
        value: CampaignKind.AaveV3Supply,
    },
    {
        label: "form.aaveV3.actions.netSupply",
        value: CampaignKind.AaveV3NetSupply,
    },
] as const;

export function AaveV3Form({
    payload,
    errors,
    // unsupportedChain,
    onChange,
    onError,
    // onPreviewClick,
}: AaveV3FormProps) {
    const { id: chainId, type: chainType } = useChainWithType();

    const { /*loading: loadingUsdNetSupply,*/ usdNetSupply } =
        useAaveV3CollateralUsdNetSupply({
            chainId,
            chainType,
            market: payload.market?.address,
            brand: payload.brand?.slug as SupportedAaveV3,
            collateral: payload.collateral?.address,
            blacklistedCrossBorrowCollaterals:
                payload.blacklistedCollaterals?.map(({ address }) => address),
            enabled: payload.kind === CampaignKind.AaveV3NetSupply,
        });

    useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(chainId, payload, usdNetSupply);
    }, [chainId, usdNetSupply, payload, errors]);

    // const noDistributables = useMemo(() => {
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

    // useEffect(() => {
    //     setPayload(initialPayload);
    // }, [chainId]);

    // const handlePayloadOnChange = useCallback(
    //     (part: AaveV3CampaignPayloadPart) => {
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

    // function handlePreviewOnClick() {
    //     onPreviewClick(previewPayload);
    // }

    // const usdTvl =
    //     payload.kind === CampaignKind.AaveV3NetSupply
    //         ? usdNetSupply
    //         : getAaveV3UsdTarget({
    //               collateral: payload.collateral,
    //               kind: payload.kind,
    //           });

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <BasicsSteps
                    payload={payload}
                    error={errors.basics}
                    onApply={onChange}
                    onError={onError}
                />
                {/* <AaveV3BrandStep
                    disabled={unsupportedChain}
                    brand={payload.brand}
                    onBrandChange={handlePayloadOnChange}
                />
                <AaveV3MarketStep
                    brand={payload.brand}
                    onMarketChange={handlePayloadOnChange}
                />
                <CampaignKindStep
                    disabled={!payload.brand || unsupportedChain}
                    kinds={kindOptions}
                    kind={payload.kind}
                    onKindChange={handlePayloadOnChange}
                />
                <AaveV3CollateralStep
                    disabled={!payload.kind || unsupportedChain}
                    brand={payload.brand}
                    kind={payload.kind}
                    market={payload.market}
                    collateral={payload.collateral}
                    onCollateralChange={handlePayloadOnChange}
                />
                {payload.kind === CampaignKind.AaveV3NetSupply && (
                    <AaveV3BlacklistedCrossBorrowCollateralsStep
                        disabled={
                            !payload.kind ||
                            !payload.collateral ||
                            unsupportedChain
                        }
                        brand={payload.brand}
                        market={payload.market}
                        collateral={payload.collateral}
                        blacklistedCollaterals={payload.blacklistedCollaterals}
                        onBlacklistedCrossBorrowCollateralsChange={
                            handlePayloadOnChange
                        }
                        onError={handlePayloadOnError}
                    />
                )}
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
                    kpiDistribution={payload.kpiDistribution}
                    fixedDistribution={payload.fixedDistribution}
                    onDistributablesChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                {payload.kind && (
                    <KpiStep
                        disabled={noDistributables || unsupportedChain}
                        kind={payload.kind}
                        loadingUsdTvl={loadingUsdNetSupply}
                        usdTvl={usdTvl}
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
                )}
                <RestrictionsStep
                    disabled={noDistributables || unsupportedChain}
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
