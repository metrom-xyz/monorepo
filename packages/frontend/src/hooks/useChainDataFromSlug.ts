import { type ChainData } from "@metrom-xyz/chains";
import { getChainDataBySlug } from "../utils/chain";

interface UseChainDataFromSlugParams {
    slug: string;
}

export function useChainDataFromSlug({
    slug,
}: UseChainDataFromSlugParams): ChainData | null {
    return getChainDataBySlug(slug) || null;
}
