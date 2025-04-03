export interface Contract {
    address: string;
    startBlock: number;
}

export interface ChainConfig {
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    contracts: {
        CrocSwapDex: Contract;
        CrocQuery: Contract;
    };
}

export const DEPLOYMENTS: Record<string, Record<string, ChainConfig>> = {
    scroll: {
        ambient: {
            nativeToken: {
                address: "0x0000000000000000000000000000000000000000",
                symbol: "ETH",
                name: "Ether",
                decimals: 18,
            },
            contracts: {
                CrocSwapDex: {
                    address: "0xaaaaAAAACB71BF2C8CaE522EA5fa455571A74106",
                    startBlock: 267408,
                },
                CrocQuery: {
                    address: "0x62223e90605845Cf5CC6DAE6E0de4CDA130d6DDf",
                    startBlock: 267408,
                },
            },
        },
    },
};
