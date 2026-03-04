export interface Contract {
    address: string;
    startBlock: number;
}

export interface ChainConfig {
    chUsd: Contract;
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
    "plasma-mainnet": {
        chUsd: {
            address: "0x22222215d4EdC5510d23D0886133E7ece7F5fdC1",
            startBlock: 15677935,
        },
    },
};
