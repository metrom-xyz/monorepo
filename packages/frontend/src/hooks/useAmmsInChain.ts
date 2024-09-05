import type { AmmInfo } from "../types";
import { useChainData } from "./useChainData";

export function useAmmsInChain(chainId?: number): AmmInfo[] {
    const chainData = useChainData(chainId);

    return chainData
        ? chainData.amms.map((amm) => ({
              slug: amm.slug,
              name: amm.name,
              logo: amm.logo,
          }))
        : [];
}
