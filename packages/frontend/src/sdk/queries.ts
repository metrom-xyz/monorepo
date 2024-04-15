import { gql } from "graphql-request";
import type { Address } from "viem";

export type GetPairsQueryParams = {
    limit: number;
    tokenParts?: string;
};

export type GetPairsQueryResult = {
    pools: {
        id: Address;
        token0: {
            id: Address;
            name: string;
            symbol: string;
            decimals: string;
        };
        token1: {
            id: Address;
            name: string;
            symbol: string;
            decimals: string;
        };
    }[];
};

export const GetPairs = gql`
    query getPools($limit: Int!, $tokenParts: String) {
        pools(
            first: $limit
            where: {
                or: [
                    { token0_: { name_contains: $tokenParts } }
                    { token0_: { symbol_contains: $tokenParts } }
                    { token1_: { name_contains: $tokenParts } }
                    { token1_: { symbol_contains: $tokenParts } }
                ]
            }
        ) {
            id
            token0 {
                id
                name
                symbol
                decimals
            }
            token1 {
                id
                name
                symbol
                decimals
            }
        }
    }
`;
