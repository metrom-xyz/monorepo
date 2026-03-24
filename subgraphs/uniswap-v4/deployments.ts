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
    base: {
        nativeToken: {
            address: "0x0000000000000000000000000000000000000000",
            decimals: 18,
            name: "Ether",
            symbol: "ETH",
        },
        dexes: {
            "uni-v4": {
                PoolManager: {
                    address: "0x498581ff718922c3f8e6a244956af099b2652b2b",
                    startBlock: 25350988,
                },
                PositionManager: {
                    address: "0x7c5f5a4bbd8fd63184577525326123b519429bdc",
                    startBlock: 25350993,
                },
            },
        },
    },
    megaeth: {
        nativeToken: {
            address: "0x0000000000000000000000000000000000000000",
            decimals: 18,
            name: "Ether",
            symbol: "ETH",
        },
        dexes: {
            "uni-v4": {
                PoolManager: {
                    address: "0xacb7e78fa05d562e0a5d3089ec896d57d057d38e",
                    startBlock: 7009653,
                },
                PositionManager: {
                    address: "0x9ae0921e981aaa7308f176f8d4f9129b9247c89d",
                    startBlock: 7009656,
                },
            },
        },
    },
};
