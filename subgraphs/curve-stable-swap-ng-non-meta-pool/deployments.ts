export interface Contract {
    address: string;
    startBlock: number;
}

export interface NamedContract extends Contract {
    name: string;
}

export interface ChainConfig {
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    DepositAndStakeZipAddress: string;
    pools: Record<string, PoolConfig>;
}

export interface PoolConfig {
    grafting?: {
        base: string;
        block: number;
    };
    Pool: Contract;
    ProxyTokens: NamedContract[];
}

export const DEPLOYMENTS: Record<string, ChainConfig> = {
    mainnet: {
        nativeToken: {
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        DepositAndStakeZipAddress: "0x56C526b0159a258887e0d79ec3a80dfb940d0cD7",
        pools: {
            "bold-usdc": {
                Pool: {
                    address: "0xEFc6516323FbD28e80B85A497B65A86243a54B3E",
                    startBlock: 22512006,
                },
                ProxyTokens: [
                    {
                        name: "GaugeToken",
                        address: "0x07a01471fA544D9C6531B631E6A96A79a9AD05E9",
                        startBlock: 22516134,
                    },
                    {
                        name: "BeefyVaultToken",
                        address: "0xC3CB31faFE8f1f2A991A833D0F0e34187bC6D5AD",
                        startBlock: 22537747,
                    },
                ],
            },
            "ebusd-usdc": {
                Pool: {
                    address: "0xd25f2cc6819fbd34641712122397efbaf9b6a6e2",
                    startBlock: 22639808,
                },
                ProxyTokens: [
                    {
                        name: "GaugeToken",
                        address: "0xc26f3C4F14e90649260A19896E27674Ba188862e",
                        startBlock: 22640658,
                    },
                ],
            },
        },
    },
};
