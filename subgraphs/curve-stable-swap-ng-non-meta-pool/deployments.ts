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
    EnsoShortcutsAddress: string;
    pools: Record<string, PoolConfig>;
}

export interface PoolConfig {
    grafting?: {
        base: string;
        block: number;
    };
    Pool: Contract;
    StakingContracts: Record<string, string>;
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
        EnsoShortcutsAddress: "0x4Fe93ebC4Ce6Ae4f81601cC7Ce7139023919E003",
        pools: {
            "bold-usdc": {
                Pool: {
                    address: "0xEFc6516323FbD28e80B85A497B65A86243a54B3E",
                    startBlock: 22512006,
                },
                StakingContracts: {
                    GaugeToken: "0x07a01471fA544D9C6531B631E6A96A79a9AD05E9",
                    BeefyVaultToken:
                        "0xC3CB31faFE8f1f2A991A833D0F0e34187bC6D5AD",
                },
            },
            "ebusd-usdc": {
                Pool: {
                    address: "0xd25f2cc6819fbd34641712122397efbaf9b6a6e2",
                    startBlock: 22639808,
                },
                StakingContracts: {
                    Gauge: "0xc26f3C4F14e90649260A19896E27674Ba188862e",
                    StakeDaoRewardVault:
                        "0x2B4b2a06C0FdeBd8de1545ABdffa64EC26416796",
                    StakeDaoConvexSidecar:
                        "0x43f78aa9af702f599270a0e8f9871d6efd885e72",
                    sdebUSDUSDCVault:
                        "0x547f9999ffBAf1158307fE554420be8D77839841",
                    ConvexVoterProxy:
                        "0x989AEb4d175e16225E39E87d0D97A3360524AD80",
                    ConvexBooster: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31",
                    EnsoShortcuts: "0x4Fe93ebC4Ce6Ae4f81601cC7Ce7139023919E003",
                    CurveYCRVVoter:
                        "0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6",
                    ebUSDUSDCConvexPoolDeposit:
                        "0x0167850fFeAC15501781E7Cb45dD7208bF60b386",
                    sdebUSDUSDCGauge:
                        "0xD1FC12930E0fC341Fec363a6B3783f9f29625A76",
                },
            },
        },
    },
};
