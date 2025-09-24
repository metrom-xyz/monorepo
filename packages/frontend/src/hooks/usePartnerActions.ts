import { useMemo } from "react";
import { useChainData } from "./useChainData";
import type { PartnerAction } from "@metrom-xyz/chains";

interface UsePartnerActionsParams {
    chainId?: number;
}

export function usePartnerActions({
    chainId,
}: UsePartnerActionsParams): PartnerAction[] {
    const chainData = useChainData({ chainId });

    return useMemo(() => {
        if (!chainData || !chainData.partnerActions) return [];
        return chainData.partnerActions.filter((action) => action.active);
    }, [chainData]);
}
