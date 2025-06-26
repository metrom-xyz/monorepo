// export interface ChainConfig {
//     PoolManager: {
//         address: string;
//         startBlock: number;
//     };
//     PositionManager: {
//         address: string;
//         startBlock: number;
//     };
// }

// Add new interface for v4 deployments
export interface ChainConfig {
    // PoolManager instead of PoolManager in V4
    PoolManager: {
        address: string;
        startBlock: number;
    };
    // PositionManager instead of PositionManager in V4: Creation of Pools and initial Liquidity
    PositionManager?: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: {
        [amm: string]: ChainConfig;
    };
} = {
    // ===== OFFICIAL V4 MAINNET DEPLOYMENTS =====
    ethereum: {
        "uni-v4": {
            PoolManager: {
                address: "0x000000000004444c5dc75cB358380D2e3dE08A90",
                startBlock: 21552733,
            },
            PositionManager: {
                address: "0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e",
                startBlock: 21552733,
            },
        },
    },
    "arbitrum-one": {
        "uni-v4": {
            PoolManager: {
                address: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
                startBlock: 165,
            },
            PositionManager: {
                address: "0xd88f38f930b7952f2db2432cb002e7abbf3dd869",
                startBlock: 173,
            },
        },
    },
    optimism: {
        "uni-v4": {
            PoolManager: {
                address: "0x9a13f98cb987694c9f086b1f5eb990eea8264ec3",
                startBlock: 129473851,
            },
            PositionManager: {
                address: "0x3c3ea4b57a46241e54610e5f022e5c45859a1017",
                startBlock: 129473851,
            },
        },
    },
    base: {
        "uni-v4": {
            PoolManager: {
                address: "0x498581ff718922c3f8e6a244956af099b2652b2b",
                startBlock: 1371680,
            },
            PositionManager: {
                address: "0x7c5f5a4bbd8fd63184577525326123b519429bdc",
                startBlock: 1371714,
            },
        },
        baseswap: {
            PoolManager: {
                address: "0x498581ff718922c3f8e6a244956af099b2652b2b",
                startBlock: 3180423,
            },
            PositionManager: {
                address: "0x7c5f5a4bbd8fd63184577525326123b519429bdc",
                startBlock: 3180608,
            },
        },
    },
    polygon: {
        "uni-v4": {
            PoolManager: {
                address: "0x67366782805870060151383f4bbff9dab53e5cd6",
                startBlock: 65450504,
            },
            PositionManager: {
                address: "0x1ec2ebf4f37e7363fdfe3551602425af0b3ceef9",
                startBlock: 65450504,
            },
        },
    },
    blast: {
        "uni-v4": {
            PoolManager: {
                address: "0x1631559198a9e474033433b2958dabc135ab6446",
                startBlock: 10506059,
            },
            PositionManager: {
                address: "0x4ad2f4cca2682cbb5b950d660dd458a1d3f1baad",
                startBlock: 10506059,
            },
        },
    },
    zora: {
        "uni-v4": {
            PoolManager: {
                address: "0x0575338e4c17006ae181b47900a84404247ca30f",
                startBlock: 20655089,
            },
            PositionManager: {
                address: "0xf66c7b99e2040f0d9b326b3b7c152e9663543d63",
                startBlock: 20655089,
            },
        },
    },
    worldchain: {
        "uni-v4": {
            PoolManager: {
                address: "0xb1860d529182ac3bc1f51fa2abd56662b7d13f33",
                startBlock: 19270006,
            },
            PositionManager: {
                address: "0xc585e0f504613b5fbf874f21af14c65260fb41fa",
                startBlock: 19270006,
            },
        },
    },
    ink: {
        "uni-v4": {
            PoolManager: {
                address: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
                startBlock: 113985,
            },
            PositionManager: {
                address: "0x1b35d13a2e2528f192637f14b05f0dc0e7deb566",
                startBlock: 113985,
            },
        },
    },
    soneium: {
        "uni-v4": {
            PoolManager: {
                address: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
                startBlock: 1021394,
            },
            PositionManager: {
                address: "0x1b35d13a2e2528f192637f14b05f0dc0e7deb566",
                startBlock: 1021394,
            },
        },
    },
    avalanche: {
        "uni-v4": {
            PoolManager: {
                address: "0x06380c0e0912312b5150364b9dc4542ba0dbbc85",
                startBlock: 54434020,
            },
            PositionManager: {
                address: "0xb74b1f14d2754acfcbbe1a221023a5cf50ab8acd",
                startBlock: 54434020,
            },
        },
    },
    bsc: {
        "uni-v4": {
            PoolManager: {
                address: "0x28e2ea090877bf75740558f6bfb36a5ffee9e9df",
                startBlock: 44756893,
            },
            PositionManager: {
                address: "0x7a4a5c919ae2541aed11041a1aeee68f1287f95b",
                startBlock: 44756893,
            },
        },
    },
    unichain: {
        "uni-v4": {
            PoolManager: {
                address: "0x1f98400000000000000000000000000000000004",
                startBlock: 1,
            },
            PositionManager: {
                address: "0x4529a01c7a0410167c5740c487a8de60232617bf",
                startBlock: 1,
            },
        },
    },

    // ===== ORIGINAL NETWORKS CONVERTED TO V4 =====
    scroll: {
        "uni-v4": {
            PoolManager: {
                address: "0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919",
                startBlock: 1367,
            },
            PositionManager: {
                address: "0xB39002E4033b162fAc607fc3471E205FA2aE5967",
                startBlock: 1375,
            },
        },
        honeypop: {
            PoolManager: {
                address: "0x1d25AF2b0992bf227b350860Ea80Bad47382CAf6",
                startBlock: 14223999,
            },
            PositionManager: {
                address: "0xB6F8D24e28bF5b8AdD2e7510f84F3b9ef03B3435",
                startBlock: 14224020,
            },
        },
    },
    taiko: {
        "uni-v4": {
            PoolManager: {
                address: "0x75FC67473A91335B5b8F8821277262a13B38c9b3",
                startBlock: 961,
            },
            PositionManager: {
                address: "0x8B3c541c30f9b29560f56B9E44b59718916B69EF",
                startBlock: 980,
            },
        },
        unagi: {
            PoolManager: {
                address: "0x78172691DD3B8ADa7aEbd9bFfB487FB11D735DB2",
                startBlock: 749458,
            },
            PositionManager: {
                address: "0x2623281DdcC34A73a9e8898f2c57A32A860903f1",
                startBlock: 750056,
            },
        },
    },
    sonic: {
        "uni-v4": {
            PoolManager: {
                address: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
                startBlock: 322744,
            },
            PositionManager: {
                address: "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c",
                startBlock: 322763,
            },
        },
    },
    telos: {
        "uni-v4": {
            PoolManager: {
                address: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
                startBlock: 386633562,
            },
            PositionManager: {
                address: "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c",
                startBlock: 386635939,
            },
        },
    },
    "lightlink-phoenix": {
        "uni-v4": {
            PoolManager: {
                address: "0xcb2436774C3e191c85056d248EF4260ce5f27A9D",
                startBlock: 131405097,
            },
            PositionManager: {
                address: "0x743E03cceB4af2efA3CC76838f6E8B50B63F184c",
                startBlock: 131405537,
            },
        },
    },
    hemi: {
        "uni-v4": {
            PoolManager: {
                address: "0x346239972d1fa486FC4a521031BC81bFB7D6e8a4",
                startBlock: 1293598,
            },
            PositionManager: {
                address: "0xEFdE184f4b5d79f7c3b7Efc0388d829ff9af0050",
                startBlock: 1293633,
            },
        },
    },
    gnosis: {
        "uni-v4": {
            PoolManager: {
                address: "0xe32F7dD7e3f098D518ff19A22d5f028e076489B1",
                startBlock: 27416614,
            },
            PositionManager: {
                address: "0xAE8fbE656a77519a7490054274910129c9244FA3",
                startBlock: 27416645,
            },
        },
    },
    lens: {
        "uni-v4": {
            PoolManager: {
                address: "0xe0704DB90bcAA1eAFc00E958FF815Ab7aa11Ef47",
                startBlock: 184120,
            },
            PositionManager: {
                address: "0xC5d0CAaE8aa00032F6DA993A69Ffa6ff80b5F031",
                startBlock: 184128,
            },
        },
    },

    // ===== TESTNET DEPLOYMENTS =====
    sepolia: {
        "uni-v4": {
            PoolManager: {
                address: "0xE03A1074c86CFeDd5C142C4F04F1a1536e203543",
                startBlock: 7280770,
            },
            PositionManager: {
                address: "0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4",
                startBlock: 7280770,
            },
        },
    },
    "unichain-sepolia": {
        "uni-v4": {
            PoolManager: {
                address: "0x00b036b58a818b1bc34d502d3fe730db729e62ac",
                startBlock: 9151,
            },
            PositionManager: {
                address: "0xf969aee60879c54baaed9f3ed26147db216fd664",
                startBlock: 9151,
            },
        },
    },
    "base-sepolia": {
        "uni-v4": {
            PoolManager: {
                address: "0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408",
                startBlock: 5190583,
            },
            PositionManager: {
                address: "0x4b2c77d209d3405f41a037ec6c77f7f5b8e2ca80",
                startBlock: 5190606,
            },
        },
    },
    "arbitrum-sepolia": {
        "uni-v4": {
            PoolManager: {
                address: "0xFB3e0C6F74eB1a21CC1Da29aeC80D2Dfe6C9a317",
                startBlock: 79470060,
            },
            PositionManager: {
                address: "0xAc631556d3d4019C95769033B5E719dD77124BAc",
                startBlock: 79470060,
            },
        },
    },
};
