export interface Contract {
    address: string;
    startBlock: number;
}

export interface NamedContract extends Contract {
    name: string;
}

export interface StandalonePool extends NamedContract {
    lpToken: string;
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
    contracts: {
        MainRegistry: Contract;
        GaugeController: Contract;
    };
}

export const DEPLOYMENTS: Record<string, ChainConfig> = {
    mainnet: {
        // grafting: {
        //     base: "QmUk4rBbqiQJ8mq3e5kALfNUP3Fbse3Qi6pB7NoqZz7nPs",
        //     block: 13392310,
        // },
        nativeToken: {
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        contracts: {
            MainRegistry: {
                address: "0x90e00ace148ca3b23ac1bc8c240c2a7dd9c2d7f5",
                startBlock: 12195750,
            },
            GaugeController: {
                address: "0x2f50d538606fa9edd2b11e2446beb18c9d5846bb",
                startBlock: 10647875,
            },
        },
    },
};
