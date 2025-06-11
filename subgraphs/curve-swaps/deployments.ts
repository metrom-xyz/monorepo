interface Pool {
    address: string;
    startBlock: number;
    tokens: string[];
}

export interface ChainConfig {
    grafting?: {
        base: string;
        block: number;
    };
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    pools: Record<string, Pool>;
}

export const DEPLOYMENTS: Record<string, ChainConfig> = {
    mainnet: {
        // grafting: {
        //     base: "QmTF79EqsfjypXxriGDjCASpnwpHqzoSiqyWh6gZk8WBG5",
        //     block: 19204800,
        // },
        nativeToken: {
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        pools: {
            "ebusd-usdc": {
                address: "0xD25f2cC6819FBD34641712122397eFbaf9b6A6e2",
                startBlock: 22674754,
                tokens: [
                    // ebUSD
                    "0x09fD37d9AA613789c517e76DF1c53aEce2b60Df4",
                    // USDC
                    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                ],
            },
        },
    },
};
