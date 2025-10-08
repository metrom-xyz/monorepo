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
    StakingContracts: NamedContract[];
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
                StakingContracts: [
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
                StakingContracts: [
                    {
                        name: "Gauge",
                        address: "0xc26f3C4F14e90649260A19896E27674Ba188862e",
                        startBlock: 22640658,
                    },
                    {
                        name: "StakeDaoRewardVault",
                        address: "0x2B4b2a06C0FdeBd8de1545ABdffa64EC26416796",
                        startBlock: 22639808,
                    },
                    {
                        name: "StakeDaoConvexSidecar",
                        address: "0x43f78aa9af702f599270a0e8f9871d6efd885e72",
                        startBlock: 22639808,
                    },
                    {
                        name: "sdebUSDUSDCVault",
                        address: "0x547f9999ffBAf1158307fE554420be8D77839841",
                        startBlock: 22639808,
                    },
                    {
                        name: "ConvexVoterProxy",
                        address: "0x989AEb4d175e16225E39E87d0D97A3360524AD80",
                        startBlock: 22639808,
                    },
                    {
                        name: "EnsoShortcuts",
                        address: "0x4Fe93ebC4Ce6Ae4f81601cC7Ce7139023919E003",
                        startBlock: 22639808,
                    },
                    {
                        name: "CurveYCRVVoter",
                        address: "0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6",
                        startBlock: 22639808,
                    },
                    {
                        name: "ebUSDUSDCConvexPoolDeposit",
                        address: "0x0167850fFeAC15501781E7Cb45dD7208bF60b386",
                        startBlock: 23095654,
                    },
                    {
                        name: "sdebUSDUSDCGauge",
                        address: "0xD1FC12930E0fC341Fec363a6B3783f9f29625A76",
                        startBlock: 23087938,
                    },
                ],
            },
        },
    },
};
