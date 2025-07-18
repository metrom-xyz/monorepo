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
    [network: string]: {
        [amm: string]: ChainConfig;
    };
} = {
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
        honeypop: {
            Factory: {
                address: "0x1d25AF2b0992bf227b350860Ea80Bad47382CAf6",
                startBlock: 14223999,
            },
            NonFungiblePositionManager: {
                address: "0xB6F8D24e28bF5b8AdD2e7510f84F3b9ef03B3435",
                startBlock: 14224020,
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
    "lightlink-phoenix": {
        "uni-v3": {
            Factory: {
                address: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
                startBlock: 131405097,
            },
            NonFungiblePositionManager: {
                address: "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c",
                startBlock: 131405537,
            },
        },
    },
    hemi: {
        "uni-v3": {
            Factory: {
                address: "0x346239972d1fa486FC4a521031BC81bFB7D6e8a4",
                startBlock: 1293598,
            },
            NonFungiblePositionManager: {
                address: "0xEFdE184f4b5d79f7c3b7Efc0388d829ff9af0050",
                startBlock: 1293633,
            },
        },
    },
    gnosis: {
        "uni-v3": {
            Factory: {
                address: "0xe32F7dD7e3f098D518ff19A22d5f028e076489B1",
                startBlock: 27416614,
            },
            NonFungiblePositionManager: {
                address: "0xAE8fbE656a77519a7490054274910129c9244FA3",
                startBlock: 27416645,
            },
        },
    },
    lens: {
        "uni-v3": {
            Factory: {
                address: "0xe0704DB90bcAA1eAFc00E958FF815Ab7aa11Ef47",
                startBlock: 184120,
            },
            NonFungiblePositionManager: {
                address: "0xC5d0CAaE8aa00032F6DA993A69Ffa6ff80b5F031",
                startBlock: 184128,
            },
        },
    },
    taraxa: {
        taraswap: {
            Factory: {
                address: "0x5EFAc029721023DD6859AFc8300d536a2d6d4c82",
                startBlock: 10674828,
            },
            NonFungiblePositionManager: {
                address: "0x1C5A295E9860d127D8A3E7af138Bb945c4377ae7",
                startBlock: 10674878,
            },
        },
    },
};
