import { request as gqlRequest } from "graphql-request";
import { Pair } from "../entities/pair";
import {
    GetPairs,
    type GetPairsQueryParams,
    type GetPairsQueryResult,
} from "../queries";
import type { SupportedAmm } from "@/types";
import { enforce } from "../utils/invariant";
import { CHAIN_DATA } from "../commons";
import { SupportedChain as MetromChainId } from "@metrom-xyz/contracts";
import { Token } from "../entities/token";

type FetcParams = {
    chainId: number;
    amm: SupportedAmm;
};

type FetchPairsParams = {
    tokenParts?: string;
} & FetcParams;

export class AmmSubgraphClient {
    public constructor() {}

    async fetchPairs(params: FetchPairsParams): Promise<Pair[]> {
        const result = await gqlRequest<
            GetPairsQueryResult,
            GetPairsQueryParams
        >({
            url: this.getSubgraphUrl(params.chainId, params.amm),
            document: GetPairs,
            variables: {
                // TODO: handle pagination
                limit: 1000,
                tokenParts: params.tokenParts || "",
            },
        });

        return result.pools.map(
            (pool) =>
                new Pair(
                    pool.id,
                    new Token(
                        params.chainId,
                        pool.token0.id,
                        Number(pool.token0.decimals),
                        pool.token0.symbol,
                        pool.token0.name,
                    ),
                    new Token(
                        params.chainId,
                        pool.token1.id,
                        Number(pool.token1.decimals),
                        pool.token1.symbol,
                        pool.token1.name,
                    ),
                ),
        );
    }

    private getSubgraphUrl(
        chainId: MetromChainId,
        ammSlug: SupportedAmm,
    ): string {
        const chainData = CHAIN_DATA[chainId];
        enforce(!!chainData, `chain ${chainId} not supported`);

        const amm = chainData.amms.find((amm) => amm.slug === ammSlug);
        enforce(
            !!amm,
            `no subgraph available in chain ${chainId} for amm ${ammSlug}`,
        );

        return amm.subgraphUrl;
    }
}
