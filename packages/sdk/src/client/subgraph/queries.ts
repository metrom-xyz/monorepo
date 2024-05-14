import { type Address } from "viem";

interface SubgraphError {
    message?: string;
}

export const query = async <R>(
    url: string,
    query: string,
    variables: { [key: string]: unknown },
): Promise<R> => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    if (!response.ok) {
        throw new Error(
            `response not ok while executing subgraph query: ${await response.text()}`,
        );
    }
    const responseJSON = await response.json();
    if (!!responseJSON.errors) {
        const errors = responseJSON.errors as SubgraphError[];
        throw new Error(
            `error returned from subgraph:\n${errors
                .filter((error) => !!error && !!error.message)
                .map((error) => `- ${error.message}`)
                .join("\n")}`,
        );
    }
    return responseJSON.data as R;
};

export type GetPairsQueryResult = {
    pools: {
        address: Address;
        token0: {
            address: Address;
            name: string;
            symbol: string;
            decimals: string;
        };
        token1: {
            address: Address;
            name: string;
            symbol: string;
            decimals: string;
        };
    }[];
};

export const GetPairs = `
    query getPools($limit: Int!, $lastId: String!) {
        pools(first: $limit, where: { id_gt: $lastId }) {
            address: id
            token0 {
                address: id
                name
                symbol
                decimals
            }
            token1 {
                address: id
                name
                symbol
                decimals
            }
        }
    }
`;

export type GetPairQueryResult = {
    pool: {
        address: Address;
        token0: {
            address: Address;
            name: string;
            symbol: string;
            decimals: string;
        };
        token1: {
            address: Address;
            name: string;
            symbol: string;
            decimals: string;
        };
    } | null;
};

export const GetPair = `
    query getPool($id: String!) {
        pool(id: $id) {
            address: id
            token0 {
                address: id
                name
                symbol
                decimals
            }
            token1 {
                address: id
                name
                symbol
                decimals
            }
        }
    }
`;

export type GetCampaignsQueryResult = {
    campaigns: {
        id: Address;
        chainId: number;
        pool: Address;
        from: number;
        to: number;
        specification: string;
        data: string;
        root: string;
        rewards: {
            id: Address;
            token: {
                address: Address;
                name: string;
                symbol: string;
                decimals: string;
            };
            amount: bigint;
            unclaimed: bigint;
        }[];
        transaction: {
            timestamp: number;
        };
    }[];
};

export const GetCampaigns = `
    query getCampaigns($limit: Int!, $lastId: String!) {
        campaigns(first: $limit, where: { id_gt: $lastId }) {
            id
            chainId
            pool
            from
            to
            specification
            data
            root
            rewards {
                id
                token {
                    address: id
                    symbol
                    name
                    decimals
                }
                amount
                unclaimed
            }
            transaction {
                timestamp
            }
        }
    }
`;
