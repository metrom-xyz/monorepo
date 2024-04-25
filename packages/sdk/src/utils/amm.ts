import type { AmmSubgraphClient } from "src";
import type { Address } from "viem";
import { cacheAmmSlug, getCachedAmmSlug } from "./cache";

export const resolveAmmSubgraphClient = async (
    pairAddress: Address,
    ammSubgraphClients: AmmSubgraphClient[],
): Promise<AmmSubgraphClient> => {
    const cachedAmmSlug = getCachedAmmSlug(pairAddress);

    let amm: AmmSubgraphClient | undefined = undefined;
    if (cachedAmmSlug) {
        amm = ammSubgraphClients.find(
            (ammClient) => ammClient.slug === cachedAmmSlug,
        );
    } else {
        await Promise.all(
            ammSubgraphClients.map(async (ammClient) => {
                const pool = await ammClient.fetchPair({
                    address: pairAddress,
                });

                if (pool) {
                    cacheAmmSlug(pairAddress, ammClient.slug);
                    amm = ammClient;
                }
            }),
        );
    }

    if (!amm) {
        throw new Error(`No subgraph client available for pair ${pairAddress}`);
    }

    return amm;
};
