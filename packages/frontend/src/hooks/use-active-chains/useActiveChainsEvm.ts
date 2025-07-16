import { useChains } from "wagmi";
import { getChainData } from "../../utils/chain";
import type { HookBaseParams } from "@/src/types/hooks";

export function useActiveChainsEvm({ enabled = true }: HookBaseParams = {}) {
    const chains = useChains();

    if (!enabled) return [];

    return chains
        .filter(({ id }) => {
            const chainData = getChainData(id);
            if (!chainData) return false;

            return chainData.active;
        })
        .map(({ id }) => id);
}
