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
