export interface ChainConfig {
    PoolAddressesProviderRegistry: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: { [brand: string]: ChainConfig };
} = {
    "arbitrum-one": {
        ploutos: {
            PoolAddressesProviderRegistry: {
                address: "0xaEe1F9b0ca49460838A49E5E9A0A02680222C5b3",
                startBlock: 380360735,
            },
        },
    },
};
