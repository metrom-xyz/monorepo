import { useChains } from "wagmi";
import { getChainData } from "../utils/chain";

export function useActiveChains() {
    const chains = useChains();

    return chains.filter(({ id }) => {
        const chainData = getChainData(id);
        if (!chainData) return false;

        return chainData.active;
    });
}
