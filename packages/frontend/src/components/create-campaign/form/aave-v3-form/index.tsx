import {
    CampaignKind,
    DistributablesType,
    SupportedAaveV3,
} from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { type CampaignKindOption } from "../../steps/campaign-kind-step";
import type { TranslationsKeys } from "@/src/types/utils";
import {
    AaveV3CampaignPreviewPayload,
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/aave-v3-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import {
    AaveV3BasicsSteps,
    REQUIRED_PAYLOAD_KEYS,
} from "./aave-v3-basics-step";
import { useAaveV3CollateralUsdNetSupply } from "@/src/hooks/useAaveV3CollateralUsdNetSupply";
import { useCallback, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { AaveV3RewardsStep } from "./aave-v3-rewards-step";
import { useFormSteps } from "@/src/context/form-steps";
import {
    allFieldsFilled,
    distributablesCompleted,
    validateDistributables,
} from "@/src/utils/form";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";
import { FormStepId } from "@/src/types/form";
import { CampaignKpiStep } from "../../steps/campaign-kpi-step";

import styles from "./styles.module.css";
import { validateDistributions } from "@/src/utils/creation-form";
import type {
    CampaignPreviewDistributables,
    CampaignPreviewFixedDistribution,
    CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";

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
    unsupportedChain: boolean;
    distributablesType: DistributablesType;
    onStepComplete: (payload: AaveV3CampaignPayloadPart) => void;
    onLaunch: () => void;
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
    distributablesType,
    // unsupportedChain,
    onStepComplete,
    onLaunch,
}: AaveV3FormProps) {
    const [payload, setPayload] = useState<AaveV3CampaignPayload>({
        distributables: { type: distributablesType },
    });

    const { errors, unsaved, updateActiveStepId } = useFormSteps();
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

    const validatedPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error) || !payload.chainId)
            return null;
        return validatePayload(payload.chainId, payload, usdNetSupply);
    }, [payload, errors, usdNetSupply]);

    const steps: FormStepId[] = useMemo(
        () => [
            FormStepId.Basics,
            FormStepId.Rewards,
            FormStepId.Kpi,
            FormStepId.Launch,
        ],
        [],
    );

    const handleOnApply = useCallback(
        (part: AaveV3CampaignPayloadPart, stepId: FormStepId) => {
            setPayload((prev) => ({ ...prev, ...part }));
            onStepComplete({ ...payload, ...part });

            const currentIndex = steps.indexOf(stepId);
            updateActiveStepId(steps[currentIndex + 1]);
        },
        [payload, steps, onStepComplete, updateActiveStepId],
    );

    // const usdTvl =
    //     payload.kind === CampaignKind.AaveV3NetSupply
    //         ? usdNetSupply
    //         : getAaveV3UsdTarget({
    //               collateral: payload.collateral,
    //               kind: payload.kind,
    //           });

    const unsavedSteps = Object.values(unsaved).some((item) => !!item);

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <AaveV3BasicsSteps payload={payload} onApply={handleOnApply} />
                <AaveV3RewardsStep
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(payload, REQUIRED_PAYLOAD_KEYS)
                    }
                    onApply={handleOnApply}
                />
                <CampaignKpiStep
                    payload={payload}
                    disabled={
                        !!errors.rewards || !distributablesCompleted(payload)
                    }
                    onApply={handleOnApply}
                />
                <CampaignApproveLaunchStep
                    payload={validatedPayload}
                    disabled={
                        unsavedSteps ||
                        !validatedPayload ||
                        !!Object.values(errors).some((error) => !!error) ||
                        !distributablesCompleted(payload)
                    }
                    onLaunch={onLaunch}
                />
                {/*{payload.kind && (
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
        </div>
    );
}
