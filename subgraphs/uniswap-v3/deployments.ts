export interface ChainConfig {
    Factory: {
        address: string;
        startBlock: number;
    };
    NonFungiblePositionManager: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: { [amm: string]: ChainConfig };
} = {
    "celo-alfajores": {
        "uni-v3": {
            Factory: {
                address: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc",
                startBlock: 12360360,
            },
            NonFungiblePositionManager: {
                address: "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A",
                startBlock: 12360382,
            },
        },
    },
    "arbitrum-one": {
        "uni-v3": {
            Factory: {
                address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
                startBlock: 165,
            },
            NonFungiblePositionManager: {
                address: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
                startBlock: 173,
            },
        },
    },
    scroll: {
        "uni-v3": {
            Factory: {
                address: "0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919",
                startBlock: 1367,
            },
            NonFungiblePositionManager: {
                address: "0xB39002E4033b162fAc607fc3471E205FA2aE5967",
                startBlock: 1375,
            },
        },
    },
    "base-sepolia": {
        "uni-v3": {
            Factory: {
                address: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
                startBlock: 5190583,
            },
            NonFungiblePositionManager: {
                address: "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2",
                startBlock: 5190606,
            },
        },
    },
    taiko: {
        "uni-v3": {
            Factory: {
                address: "0x75FC67473A91335B5b8F8821277262a13B38c9b3",
                startBlock: 961,
            },
            NonFungiblePositionManager: {
                address: "0x8B3c541c30f9b29560f56B9E44b59718916B69EF",
                startBlock: 980,
            },
        },
        unagi: {
            Factory: {
                address: "0x78172691DD3B8ADa7aEbd9bFfB487FB11D735DB2",
                startBlock: 749458,
            },
            NonFungiblePositionManager: {
                address: "0x2623281DdcC34A73a9e8898f2c57A32A860903f1",
                startBlock: 750056,
            },
        },
    },
    base: {
        "uni-v3": {
            Factory: {
                address: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
                startBlock: 1371680,
            },
            NonFungiblePositionManager: {
                address: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
                startBlock: 1371714,
            },
        },
        baseswap: {
            Factory: {
                address: "0x38015D05f4fEC8AFe15D7cc0386a126574e8077B",
                startBlock: 3180423,
            },
            NonFungiblePositionManager: {
                address: "0xDe151D5c92BfAA288Db4B67c21CD55d5826bCc93",
                startBlock: 3180608,
            },
        },
    },
    sonic: {
        "uni-v3": {
            Factory: {
                address: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
                startBlock: 322744,
            },
            NonFungiblePositionManager: {
                address: "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c",
                startBlock: 322763,
            },
        },
    },
    telos: {
        "uni-v3": {
            Factory: {
                address: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
                startBlock: 386633562,
            },
            NonFungiblePositionManager: {
                address: "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c",
                startBlock: 386635939,
            },
        },
    },
};
