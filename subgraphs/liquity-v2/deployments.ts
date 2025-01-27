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
        ebisu: {
            DebtToken: {
                address: "0xa4e721039da9e14332fec14f98f463d92623149a",
                startBlock: 7427272,
            },
        },
    },
};
