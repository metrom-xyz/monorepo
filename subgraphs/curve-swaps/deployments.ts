interface Contract {
    address: string;
    startBlock: number;
}

interface Pool {
    address: string;
    targetToken: string;
}

export interface ChainConfig {
    grafting?: {
        base: string;
        block: number;
    };
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    routers: {
        curve: Contract;
        gpv2Settlement: Contract;
    };
    pools: Record<string, Pool>;
}

export const DEPLOYMENTS: Record<string, ChainConfig> = {
    mainnet: {
        // grafting: {
        //     base: "QmTF79EqsfjypXxriGDjCASpnwpHqzoSiqyWh6gZk8WBG5",
        //     block: 19204800,
        // },
        nativeToken: {
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        routers: {
            curve: {
                address: "0x45312ea0eff7e09c83cbe249fa1d7598c4c8cd4e",
                startBlock: 22773375,
            },
            gpv2Settlement: {
                address: "0x5141B82f5fFDa4c6fE1E372978F1C5427640a190",
                startBlock: 22773375,
            },
        },
        pools: {
            "ebusd-usdc": {
                address: "0xD25f2cC6819FBD34641712122397eFbaf9b6A6e2",
                targetToken: "0x09fD37d9AA613789c517e76DF1c53aEce2b60Df4", // ebUSD
            },
        },
    },
};
