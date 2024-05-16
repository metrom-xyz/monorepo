import { SupportedChain } from "@metrom-xyz/contracts";
import { GetPairs, type GetPairsQueryResult, query } from "./queries";
import { type Pair } from "../../entities";
import type { Address } from "viem";

const PAGE_SIZE = 500;

export type GetPairsQueryParams = {
    limit: number;
    tokenParts?: string;
};

export type FetchParamsParams = {
    address: Address;
};

export class AmmSubgraphClient {
    public constructor(
        public readonly chain: SupportedChain,
        public readonly slug: string,
        public readonly url: string,
    ) {}

    async fetchPairs(): Promise<Pair[]> {
        let lastId = null;
        const pairs = [];
        do {
            const result: GetPairsQueryResult = await query(
                this.url,
                GetPairs,
                { limit: PAGE_SIZE, lastId: lastId || "" },
            );

            for (const pool of result.pools) {
                pairs.push(<Pair>{
                    address: pool.address,
                    token0: {
                        chainId: this.chain,
                        address: pool.token0.address,
                        decimals: parseInt(pool.token0.decimals),
                        symbol: pool.token0.symbol,
                        name: pool.token0.name,
                    },
                    token1: {
                        chainId: this.chain,
                        address: pool.token1.address,
                        decimals: parseInt(pool.token1.decimals),
                        symbol: pool.token1.symbol,
                        name: pool.token1.name,
                    },
                });
            }

            lastId =
                result.pools.length < PAGE_SIZE
                    ? null
                    : result.pools[result.pools.length - 1].address;
        } while (lastId);

        return pairs;
    }
}
