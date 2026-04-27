import {
    CampaignKind,
    DistributablesType,
    SupportedAaveV3,
} from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import {
    AaveV3CampaignPreviewPayload,
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/aave-v3-campaign";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import {
    AaveV3BasicsStep,
    AAVE_V3_REQUIRED_PAYLOAD_KEYS,
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
    validateDistributions,
} from "@/src/utils/form";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";
import { FormStepId } from "@/src/types/form";
import { CampaignKpiStep } from "../../steps/campaign-kpi-step";
import type {
    CampaignPreviewFixedDistribution,
    CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";
import { getAaveV3UsdTarget } from "@/src/utils/aave-v3";

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
            distributables,
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
        distributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface AaveV3FormProps {
    distributablesType: DistributablesType;
    onStepComplete: (payload: AaveV3CampaignPayloadPart) => void;
    onLaunch: () => void;
}

export function AaveV3Form({
    distributablesType,
    onStepComplete,
    onLaunch,
}: AaveV3FormProps) {
    const [payload, setPayload] = useState<AaveV3CampaignPayload>({
        distributables: { type: distributablesType },
    });

    const { errors, unsaved, activeStepId, updateActiveStepId } =
        useFormSteps();
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

            const currentIndex = steps.indexOf(activeStepId);
            const appliedStepIndex = steps.indexOf(stepId);

            const nextStepIndex =
                currentIndex > appliedStepIndex
                    ? currentIndex
                    : appliedStepIndex + 1;

            const next = steps[nextStepIndex];
            if (!next) return;
            updateActiveStepId(next);
        },
        [payload, activeStepId, steps, onStepComplete, updateActiveStepId],
    );

    const targetUsdValue =
        payload.kind === CampaignKind.AaveV3NetSupply
            ? usdNetSupply
            : getAaveV3UsdTarget({
                  collateral: payload.collateral,
                  kind: payload.kind,
              });

    const unsavedSteps = Object.values(unsaved).some((item) => !!item);

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <AaveV3BasicsStep payload={payload} onApply={handleOnApply} />
                <AaveV3RewardsStep
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(payload, AAVE_V3_REQUIRED_PAYLOAD_KEYS)
                    }
                    onApply={handleOnApply}
                />
                <CampaignKpiStep
                    payload={payload}
                    targetUsdValue={targetUsdValue}
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
            </div>
        </div>
    );
}
