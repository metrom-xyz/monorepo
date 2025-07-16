import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    type ProtocolBase,
} from "@metrom-xyz/chains";
import { APTOS, ENVIRONMENT } from "../commons/env";

export function useSupportedProtocols(): ProtocolBase[] {
    const protocols: Record<string, ProtocolBase> = {};

    const chains = APTOS
        ? MVM_CHAIN_DATA[ENVIRONMENT]
        : EVM_CHAIN_DATA[ENVIRONMENT];

    Object.entries(chains).forEach(([_, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocols[protocol.slug]) {
                protocols[protocol.slug] = protocol;
            }
        }
    });

    return Object.values(protocols);
}
