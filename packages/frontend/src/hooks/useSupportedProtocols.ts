import { CHAIN_DATA } from "../commons";
import { type ProtocolBase } from "../types/protocol";

export function useSupportedProtocols(): ProtocolBase[] {
    const protocols: Record<string, ProtocolBase> = {};

    Object.entries(CHAIN_DATA).forEach(([_, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocols[protocol.slug]) {
                protocols[protocol.slug] = protocol;
            }
        }
    });

    return Object.values(protocols);
}
