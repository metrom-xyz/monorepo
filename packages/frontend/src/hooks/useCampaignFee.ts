import { useEffect, useMemo, useState } from "react";
import { useProtocolFees } from "./useProtocolFees";
import type { CampaignPayloadDistributables } from "../types/campaign/common";
import { FEE_UNIT } from "../commons";
import { DistributablesType } from "@metrom-xyz/sdk";

interface UseCampaignFeeProps {
    distributables?: CampaignPayloadDistributables;
}

export function useCampaignFee({ distributables }: UseCampaignFeeProps) {
    const { fee, feeRebate, loading } = useProtocolFees({
        enabled: !!distributables,
    });

    const [resolvedFee, setResolvedFee] = useState<number>();

    const totalRewardsUsdAmount = useMemo(() => {
        if (
            !distributables ||
            distributables.type !== DistributablesType.Tokens ||
            !distributables.tokens
        )
            return 0;

        let total = 0;
        for (const reward of distributables.tokens) {
            if (!reward.amount.usdValue) return 0;
            total += reward.amount.usdValue;
        }
        return total;
    }, [distributables]);

    useEffect(() => {
        if (fee !== undefined && feeRebate === undefined) setResolvedFee(fee);
        else if (fee !== undefined && feeRebate !== undefined) {
            const resolvedFeeRebate = feeRebate / FEE_UNIT;
            setResolvedFee(fee - fee * resolvedFeeRebate);
        }
    }, [feeRebate, fee]);

    const campaignFee =
        resolvedFee !== undefined
            ? (totalRewardsUsdAmount * resolvedFee) / FEE_UNIT
            : null;

    return { loading, campaignFee };
}
