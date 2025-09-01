import { APTOS } from "@/src/commons/env";
import { useChains } from "wagmi";
import { getChainData } from "@/src/utils/chain";
import { SUPPORTED_CHAINS_MVM } from "@/src/commons";

export function useActiveChains() {
    const evmChains = useChains();

    const activeEvmChains = evmChains
        .filter(({ id }) => {
            const chainData = getChainData(id);
            if (!chainData) return false;
            return chainData.active;
        })
        .map(({ id }) => id);

    if (APTOS) return SUPPORTED_CHAINS_MVM;
    return activeEvmChains;
}
