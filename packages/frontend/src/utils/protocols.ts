import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    ProtocolType,
    SVM_CHAIN_DATA,
} from "@metrom-xyz/chains";
import {
    ChainType,
    SupportedLiquidityProviderDeal,
    SupportedTurtleDeal,
    type SupportedProtocol,
} from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "../commons/env";
import { NetworkToChainId } from "@aptos-labs/ts-sdk";
import type { ChainWithType } from "../types/chain";
import { getChainType, solanaNetworkToId } from "./chain";

export function getChainsForProtocol(
    protocol: SupportedProtocol,
    crossVm = false,
): ChainWithType[] {
    const chainType = getChainType();

    const chainsEvm = new Set<ChainWithType>();
    const chainsMvm = new Set<ChainWithType>();
    const chainsSvm = new Set<ChainWithType>();

    Object.entries(EVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (chainData.protocols.find(({ slug }) => slug === protocol))
                chainsEvm.add({ id: Number(chain), type: ChainType.Evm });
        },
    );

    Object.entries(MVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (chainData.protocols.find(({ slug }) => slug === protocol))
                chainsMvm.add({
                    id: NetworkToChainId[chain],
                    type: ChainType.Aptos,
                });
        },
    );

    Object.entries(SVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (chainData.protocols.find(({ slug }) => slug === protocol))
                chainsSvm.add({
                    id: solanaNetworkToId(chain),
                    type: ChainType.Svm,
                });
        },
    );

    if (crossVm) return Array.from(chainsEvm.union(chainsMvm).union(chainsSvm));

    switch (chainType) {
        case ChainType.Evm:
            return Array.from(chainsEvm);
        case ChainType.Aptos:
            return Array.from(chainsMvm);
        case ChainType.Svm:
            return Array.from(chainsSvm);
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}

export function getChainsForTurtleDeal(
    deal: SupportedTurtleDeal,
    crossVm = false,
): ChainWithType[] {
    const chainType = getChainType();

    const chainsEvm = new Set<ChainWithType>();
    const chainsMvm = new Set<ChainWithType>();
    const chainsSvm = new Set<ChainWithType>();

    Object.entries(EVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (
                chainData.protocols.find(
                    (protocol) =>
                        protocol.type === ProtocolType.LiquidityProviderDeal &&
                        protocol.slug ===
                            SupportedLiquidityProviderDeal.Turtle &&
                        protocol.deal === deal,
                )
            )
                chainsEvm.add({ id: Number(chain), type: ChainType.Evm });
        },
    );

    Object.entries(MVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (
                chainData.protocols.find(
                    (protocol) =>
                        protocol.type === ProtocolType.LiquidityProviderDeal &&
                        protocol.slug ===
                            SupportedLiquidityProviderDeal.Turtle &&
                        protocol.deal === deal,
                )
            ) {
                chainsMvm.add({
                    id: NetworkToChainId[chain],
                    type: ChainType.Aptos,
                });
            }
        },
    );

    Object.entries(SVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (
                chainData.protocols.find(
                    (protocol) =>
                        protocol.type === ProtocolType.LiquidityProviderDeal &&
                        protocol.slug ===
                            SupportedLiquidityProviderDeal.Turtle &&
                        protocol.deal === deal,
                )
            ) {
                chainsSvm.add({
                    id: solanaNetworkToId(chain),
                    type: ChainType.Svm,
                });
            }
        },
    );

    if (crossVm) return Array.from(chainsEvm.union(chainsMvm).union(chainsSvm));

    switch (chainType) {
        case ChainType.Evm:
            return Array.from(chainsEvm);
        case ChainType.Aptos:
            return Array.from(chainsMvm);
        case ChainType.Svm:
            return Array.from(chainsSvm);
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
