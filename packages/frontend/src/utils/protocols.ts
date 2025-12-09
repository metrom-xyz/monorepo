import { EVM_CHAIN_DATA, MVM_CHAIN_DATA } from "@metrom-xyz/chains";
import { ChainType, type SupportedProtocol } from "@metrom-xyz/sdk";
import { APTOS, ENVIRONMENT } from "../commons/env";
import { NetworkToChainId } from "@aptos-labs/ts-sdk";
import type { ChainWithType } from "../types/chain";

export function getChainsForProtocol(
    protocol: SupportedProtocol,
    crossVm = false,
): ChainWithType[] {
    const chainsEvm = new Set<ChainWithType>();
    const chainsMvm = new Set<ChainWithType>();

    Object.entries(EVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (chainData.protocols.find(({ slug }) => slug === protocol)) {
                chainsEvm.add({ id: Number(chain), type: ChainType.Evm });
            }
        },
    );

    Object.entries(MVM_CHAIN_DATA[ENVIRONMENT]).forEach(
        ([chain, chainData]) => {
            if (chainData.protocols.find(({ slug }) => slug === protocol)) {
                chainsMvm.add({
                    id: NetworkToChainId[chain],
                    type: ChainType.Aptos,
                });
            }
        },
    );

    if (crossVm) return Array.from(chainsEvm.union(chainsMvm));

    if (APTOS) return Array.from(chainsMvm);
    return Array.from(chainsEvm);
}
