export interface NetworkConfig {
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    dexes: Record<
        string,
        {
            PoolManager: {
                address: string;
                startBlock: number;
            };
            PositionManager: {
                address: string;
                startBlock: number;
            };
        }
    >;
}

export const DEPLOYMENTS: {
    [network: string]: NetworkConfig;
} = {
    sepolia: {
        nativeToken: {
            address: "0x0000000000000000000000000000000000000000",
            decimals: 18,
            name: "Ether",
            symbol: "ETH",
        },
        dexes: {
            "uni-v4": {
                PoolManager: {
                    address: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
                    startBlock: 7258946,
                },
                PositionManager: {
                    address: "0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4",
                    startBlock: 7259148,
                },
            },
        },
    },
};
