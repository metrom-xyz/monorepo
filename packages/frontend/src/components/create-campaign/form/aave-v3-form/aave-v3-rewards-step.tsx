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
    getCampaignFormApr,
    restrictionsEqual,
} from "@/src/utils/form";
import { useAaveV3CollateralUsdNetSupply } from "@/src/hooks/useAaveV3CollateralUsdNetSupply";
import {
    CampaignKind,
    DistributablesType,
    RestrictionType,
} from "@metrom-xyz/sdk";
import { useFormSteps } from "@/src/context/form-steps";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import type { Address } from "viem";
import type { FormStepId } from "@/src/types/form";

interface AaveV3RewardsStepProps {
    payload: AaveV3CampaignPayload;
    disabled?: boolean;
    onApply: (payload: AaveV3CampaignPayloadPart, stepId: FormStepId) => void;
}

export function AaveV3RewardsStep({
    payload,
    disabled,
    onApply,
}: AaveV3RewardsStepProps) {
    const [rewardsPayload, setRewardsPayload] = useState({
        distributables: payload.distributables,
        restrictions: {
            type: RestrictionType.Blacklist,
            list: [] as Address[],
        },
    });

    const { errors } = useFormSteps();
    const { id: chainId, type: chainType } = useChainWithType();
    const {
        loading: loadingCollateralUsdNetSupply,
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

        return (
            !distributablesEqual(payload, rewardsPayload) ||
            !restrictionsEqual(payload, rewardsPayload)
        );
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
    const apr = getCampaignFormApr(
        payloadForApr,
        getAaveV3TargetValue(payload, usdNetSupply),
    );

    const applyDisabled =
        !!errors.rewards ||
        !unsavedChanges ||
        !distributablesCompleted(rewardsPayload);

    const completed =
        !errors.rewards &&
        !unsavedChanges &&
        distributablesCompleted(rewardsPayload);

    function handlePayloadOnChange(part: AaveV3CampaignPayloadPart) {
        setRewardsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignRewardsStep
            chainId={chainId}
            startDate={payload.startDate}
            endDate={payload.endDate}
            payload={rewardsPayload}
            apr={apr}
            loadingApr={loadingCollateralUsdNetSupply}
            applyDisabled={applyDisabled}
            completed={!!completed}
            disabled={disabled}
            unsavedChanges={!disabled && unsavedChanges}
            onApply={onApply}
            onChange={handlePayloadOnChange}
        />
    );
}
