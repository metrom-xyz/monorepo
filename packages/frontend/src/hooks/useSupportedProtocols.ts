import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    type ProtocolBase,
} from "@metrom-xyz/chains";
import { APTOS, ENVIRONMENT } from "../commons/env";
import type { HookCrossVmParams } from "../types/hooks";

type UseSupportedProtocolsParams = HookCrossVmParams;

export function useSupportedProtocols({
    crossVm = false,
}: UseSupportedProtocolsParams = {}): ProtocolBase[] {
    const protocolsEvm: Record<string, ProtocolBase> = {};
    const protocolsMvm: Record<string, ProtocolBase> = {};

    Object.entries(MVM_CHAIN_DATA[ENVIRONMENT]).forEach(([, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocolsMvm[protocol.slug]) {
                protocolsMvm[protocol.slug] = protocol;
            }
        }
    });

    Object.entries(EVM_CHAIN_DATA[ENVIRONMENT]).forEach(([, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocolsEvm[protocol.slug]) {
                protocolsEvm[protocol.slug] = protocol;
            }
        }
    });

    if (crossVm)
        return [...Object.values(protocolsEvm), ...Object.values(protocolsMvm)];

    if (APTOS) return Object.values(protocolsMvm);
    return Object.values(protocolsEvm);
}
