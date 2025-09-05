import { APTOS } from "@/src/commons/env";
import { useChains } from "wagmi";
import { getChainData } from "@/src/utils/chain";
import { SUPPORTED_CHAINS_MVM } from "@/src/commons";
import { ChainType } from "@metrom-xyz/sdk";
import type { ChainWithType } from "../types/chain";

export function useActiveChains(): ChainWithType[] {
    const evmChains = useChains();

    const activeEvmChains = evmChains
        .filter(({ id }) => {
            const chainData = getChainData(id);
            if (!chainData) return false;
            return chainData.active;
        })
        .map(({ id }) => ({ id, type: ChainType.Evm }));

    if (APTOS)
        return SUPPORTED_CHAINS_MVM.map((id) => ({
            id,
            type: ChainType.Aptos,
        }));
    return activeEvmChains;
}
