import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    SVM_CHAIN_DATA,
    type ProtocolBase,
} from "@metrom-xyz/chains";
import { ENVIRONMENT } from "../commons/env";
import type { HookCrossVmParams } from "../types/hooks";
import { useChainType } from "./useChainType";
import { ChainType } from "@metrom-xyz/sdk";

type UseSupportedProtocolsParams = HookCrossVmParams;

export function useSupportedProtocols({
    crossVm = false,
}: UseSupportedProtocolsParams = {}): ProtocolBase[] {
    const chainType = useChainType();

    const protocolsEvm: Record<string, ProtocolBase> = {};
    const protocolsMvm: Record<string, ProtocolBase> = {};
    const protocolsSvm: Record<string, ProtocolBase> = {};

    Object.entries(MVM_CHAIN_DATA[ENVIRONMENT]).forEach(([, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocolsMvm[protocol.slug])
                protocolsMvm[protocol.slug] = protocol;
        }
    });

    Object.entries(EVM_CHAIN_DATA[ENVIRONMENT]).forEach(([, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocolsEvm[protocol.slug])
                protocolsEvm[protocol.slug] = protocol;
        }
    });

    Object.entries(SVM_CHAIN_DATA[ENVIRONMENT]).forEach(([, chainData]) => {
        for (const protocol of chainData.protocols) {
            if (!protocolsSvm[protocol.slug])
                protocolsSvm[protocol.slug] = protocol;
        }
    });

    if (crossVm)
        return [
            ...Object.values(protocolsEvm),
            ...Object.values(protocolsMvm),
            ...Object.values(protocolsSvm),
        ];

    switch (chainType) {
        case ChainType.Evm:
            return Object.values(protocolsEvm);
        case ChainType.Aptos:
            return Object.values(protocolsMvm);
        case ChainType.Svm:
            return Object.values(protocolsSvm);
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useSupportedProtocols`,
            );
    }
}
