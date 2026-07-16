import { useChains } from "wagmi";
import { ChainType } from "@metrom-xyz/sdk";
import { getCrossVmChainData } from "../utils/chain";
import { SUPPORTED_CHAINS_MVM } from "../commons";
import { useChainType } from "../context/chain-type";
import type { ChainWithType } from "../types/chain";

export function useActiveChains(): ChainWithType[] {
    const { chainType } = useChainType();
    const evmChains = useChains();

    switch (chainType) {
        case ChainType.Evm:
            return evmChains
                .filter(({ id }) => {
                    const chainData = getCrossVmChainData(id, ChainType.Evm);
                    if (!chainData) return false;
                    return chainData.active;
                })
                .map(({ id }) => ({ id, type: ChainType.Evm }));
        case ChainType.Aptos:
            return SUPPORTED_CHAINS_MVM.map((id) => ({
                id,
                type: ChainType.Aptos,
            }));
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
