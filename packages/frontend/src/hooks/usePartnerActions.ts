import { useMemo } from "react";
import { useChainData } from "./useChainData";
import type { PartnerAction, PartnerActionType } from "@metrom-xyz/chains";

interface UsePartnerActionsParams {
    chainId?: number;
}

// interface PartnerActionWithProtocol extends PartnerAction {
//     protocol: ProtocolType;
// }

export function usePartnerActions({
    chainId,
}: UsePartnerActionsParams): PartnerAction[] {
    const chainData = useChainData({ chainId });

    return useMemo(() => {
        if (!chainData || !chainData.partnerActions) return [];
        return chainData.partnerActions;
    }, [chainData]);

    // return useMemo(() => {
    //     if (!chainData || !chainData.partnerActions) return undefined;
    //     return chainData.partnerActions.reduce(
    //         (acc, action) => {
    //             if (!acc[action.type]) acc[action.type] = [];
    //             acc[action.type].push(action);
    //             return acc;
    //         },
    //         {} as Record<CampaignType, PartnerAction[]>,
    //     );
    // }, [chainData]);

    // return chainData.protocols
    //     .filter((protocol) => {
    //         if (protocolType && protocol.type !== protocolType)
    //             return false;
    //         return protocol.active && !!protocol.partnerActions;
    //     })
    //     .map((protocol) =>
    //         protocol.partnerActions!.map((partnerAction) => ({
    //             ...partnerAction,
    //             protocol: protocol.type,
    //         })),
    //     )
    //     .flat() as PartnerActionWithProtocol[];
}
