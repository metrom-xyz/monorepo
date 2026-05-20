import { useChains } from "wagmi";
import { getChainData, solanaNetworkToId } from "@/src/utils/chain";
import { SUPPORTED_CHAINS_MVM } from "@/src/commons";
import { ChainType } from "@metrom-xyz/sdk";
import type { ChainWithType } from "../types/chain";
import { useChainType } from "./useChainType";
import { useSolanaClient } from "@solana/react-hooks";

export function useActiveChains(): ChainWithType[] {
    const chainType = useChainType();
    const evmChains = useChains();
    const solanaClient = useSolanaClient();

    switch (chainType) {
        case ChainType.Evm:
            return evmChains
                .filter(({ id }) => {
                    const chainData = getChainData(id);
                    if (!chainData) return false;
                    return chainData.active;
                })
                .map(({ id }) => ({ id, type: ChainType.Evm }));
        case ChainType.Aptos:
            return SUPPORTED_CHAINS_MVM.map((id) => ({
                id,
                type: ChainType.Aptos,
            }));
        case ChainType.Svm:
            return [
                {
                    // Solana active chain is just the one configured in the client
                    id: solanaNetworkToId(solanaClient.config.cluster),
                    type: ChainType.Svm,
                },
            ];
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useActiveChains`,
            );
    }
}
