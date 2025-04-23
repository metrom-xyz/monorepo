import { CHAIN_DATA } from "../commons";
import { LIQUITY_V2_CAMPAIGN } from "../commons/env";
import { ProtocolType, type ProtocolBase } from "../types/common";

export function useSupportedProtocols(): ProtocolBase[] {
    const protocols: Record<string, ProtocolBase> = {};

    Object.entries(CHAIN_DATA).forEach(([_, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (
                !LIQUITY_V2_CAMPAIGN &&
                protocol.type === ProtocolType.LiquityV2
            )
                continue;

            if (!protocols[protocol.slug]) {
                protocols[protocol.slug] = protocol;
            }
        }
    });

    return Object.values(protocols);
}
