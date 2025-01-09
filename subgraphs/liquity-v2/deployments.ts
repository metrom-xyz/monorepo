export interface ChainConfig {
    DebtToken: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: { [fork: string]: ChainConfig };
} = {
    sepolia: {
        liquity: {
            DebtToken: {
                address: "0x620ce1130f7c63457784cdfa31cfccbfb6be5029",
                startBlock: 7129282,
            },
        },
    },
};
