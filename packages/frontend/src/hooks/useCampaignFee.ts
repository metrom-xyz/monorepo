import { useMemo } from "react";
import { useProtocolFees } from "./use-protocol-fees";
import type { CampaignPayloadDistributables } from "../types/campaign/common";
import { FEE_UNIT } from "../commons";
import { DistributablesType } from "@metrom-xyz/sdk";

interface UseCampaignFeeProps {
    chainId?: number;
    distributables?: CampaignPayloadDistributables;
}

export function useCampaignFee({
    chainId,
    distributables,
}: UseCampaignFeeProps) {
    const { fee, feeRebate, loading } = useProtocolFees({
        chainId,
        enabled: !!distributables,
    });

    const totalRewardsUsdAmount = useMemo(() => {
        if (!distributables) return 0;

        if (
            distributables.type === DistributablesType.FixedPoints &&
            distributables.fee
        ) {
            return distributables.fee.amount.usdValue;
        }

        if (
            distributables.type === DistributablesType.Tokens &&
            distributables.tokens
        ) {
            let total = 0;
            for (const reward of distributables.tokens) {
                if (!reward.amount.usdValue) return 0;
                total += reward.amount.usdValue;
            }
            return total;
        }

        return 0;
    }, [distributables]);

    let resolvedFee: number | undefined;
    if (fee !== undefined && feeRebate === undefined) resolvedFee = fee;
    else if (fee !== undefined && feeRebate !== undefined) {
        const resolvedFeeRebate = feeRebate / FEE_UNIT;
        resolvedFee = fee - fee * resolvedFeeRebate;
    }

    const campaignFee =
        resolvedFee !== undefined
            ? (totalRewardsUsdAmount * resolvedFee) / FEE_UNIT
            : null;

    return { loading, campaignFee };
}
