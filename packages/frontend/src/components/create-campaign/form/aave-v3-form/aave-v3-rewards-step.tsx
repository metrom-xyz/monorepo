import {
    getAaveV3TargetValue,
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/aave-v3-campaign";
import { CampaignRewardsStep } from "../../steps/campaign-rewards-step";
import { useMemo, useState } from "react";
import {
    distributablesCompleted,
    distributablesEqual,
    getCampaignApr,
} from "@/src/utils/form";
import { useAaveV3CollateralUsdNetSupply } from "@/src/hooks/useAaveV3CollateralUsdNetSupply";
import { useChainType } from "@/src/hooks/useChainType";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import type { CompletedRequiredSteps } from "..";
import { useFormErrors } from "@/src/context/form-errors";

interface AaveV3RewardsStepProps {
    payload: AaveV3CampaignPayload;
    disabled?: boolean;
    onComplete: (steps: Partial<CompletedRequiredSteps>) => void;
    onApply: (payload: AaveV3CampaignPayloadPart) => void;
}

export function AaveV3RewardsStep({
    payload,
    disabled,
    onComplete,
    onApply,
}: AaveV3RewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
    });

    const { errors } = useFormErrors();
    const chainType = useChainType();
    const {
        // loading: loadingCollateralUsdNetSupply,
        usdNetSupply: collateralUsdNetSupply,
    } = useAaveV3CollateralUsdNetSupply({
        chainId: payload.chainId,
        chainType,
        brand: payload.brand?.slug,
        market: payload.market?.address,
        collateral: payload.collateral?.address,
        blacklistedCrossBorrowCollaterals: payload.blacklistedCollaterals?.map(
            ({ address }) => address,
        ),
        enabled: payload.kind === CampaignKind.AaveV3NetSupply,
    });

    const unsavedChanges = useMemo(() => {
        if (
            !distributablesCompleted(rewardsPayload) &&
            distributablesCompleted(payload)
        )
            return true;

        return !distributablesEqual(payload, rewardsPayload);
    }, [payload, rewardsPayload]);

    const usdNetSupply =
        payload.kind === CampaignKind.AaveV3NetSupply
            ? collateralUsdNetSupply
            : undefined;

    const payloadForApr = {
        ...payload,
        distributables: {
            type:
                rewardsPayload.distributables?.type ||
                DistributablesType.Tokens,
            ...rewardsPayload.distributables,
        },
    };
    const apr = getCampaignApr(
        payloadForApr,
        getAaveV3TargetValue(payload, usdNetSupply),
    );

    const applyDisabled =
        !!errors.rewards || !unsavedChanges || !rewardsPayload.distributables;

    const completed =
        !errors.rewards &&
        !unsavedChanges &&
        distributablesCompleted(rewardsPayload);

    function handlePayloadOnChange(part: AaveV3CampaignPayloadPart) {
        setRewardsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignRewardsStep
            chainId={payload.chainId}
            startDate={payload.startDate}
            endDate={payload.endDate}
            payload={rewardsPayload}
            apr={apr}
            applyDisabled={applyDisabled}
            completed={!!completed}
            disabled={disabled}
            unsavedChanges={!disabled && unsavedChanges}
            onComplete={onComplete}
            onApply={onApply}
            onChange={handlePayloadOnChange}
        />
    );
}
