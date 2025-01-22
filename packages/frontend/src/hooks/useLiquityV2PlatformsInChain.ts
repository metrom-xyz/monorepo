import type { LiquityV2Brand } from "../types";
import { useChainData } from "./useChainData";

export function useLiquityV2PlatformsInChain(
    chainId?: number,
): LiquityV2Brand[] {
    const chainData = useChainData(chainId);

    if (!chainData) return [];

    return chainData.liquityV2Brands.map((liquityV2Platform) => ({
        slug: liquityV2Platform.slug,
        name: liquityV2Platform.name,
        logo: liquityV2Platform.logo,
    }));
}
