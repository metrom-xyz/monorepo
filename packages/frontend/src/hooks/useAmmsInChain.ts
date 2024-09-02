import type { AmmInfo } from "../types";
import { useChainData } from "./useChainData";

export function useAmmsInChain(): AmmInfo[] {
    const chainData = useChainData();

    return chainData.amms.map((amm) => ({
        slug: amm.slug,
        name: amm.name,
        logo: amm.logo,
    }));
}
