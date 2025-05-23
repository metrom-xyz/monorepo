import { CHAIN_DATA, type ProtocolBase } from "@metrom-xyz/chains";
import { ENVIRONMENT } from "../commons/env";

export function useSupportedProtocols(): ProtocolBase[] {
    const protocols: Record<string, ProtocolBase> = {};

    Object.entries(CHAIN_DATA[ENVIRONMENT]).forEach(([_, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocols[protocol.slug]) {
                protocols[protocol.slug] = protocol;
            }
        }
    });

    return Object.values(protocols);
}
