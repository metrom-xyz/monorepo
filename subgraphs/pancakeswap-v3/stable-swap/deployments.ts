export interface AmmConfig {
    Factory: {
        address: string;
        startBlock: number;
    };
}

export interface ChainConfig {
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    amms: Record<string, AmmConfig>;
}

export const DEPLOYMENTS: Record<string, ChainConfig> = {
    taiko: {
        nativeToken: {
            address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        amms: {
            panko: {
                Factory: {
                    address: "0x542E849ff47da056c127F35710b01242A59705d2",
                    startBlock: 433345,
                },
            },
        },
    },
};
