export interface Contract {
    address: string;
    startBlock: number;
}

export interface ChainConfig {
    PositionRegistry: Contract;
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    base: {
        PositionRegistry: {
            address: "0xeE156D8ea7b96a5524CcC3CF9283ab85E80E9534",
            startBlock: 25696510,
        },
    },
    mainnet: {
        PositionRegistry: {
            address: "0xeE156D8ea7b96a5524CcC3CF9283ab85E80E9534",
            startBlock: 21732500,
        },
    },
};
