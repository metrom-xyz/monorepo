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
                address: "0xb01D32c05f4aA066EeF2bFd4D461833fddD56D0A",
                startBlock: 7532680,
            },
        },
        ebisu: {
            DebtToken: {
                address: "0xa4e721039da9e14332fec14f98f463d92623149a",
                startBlock: 7427272,
            },
        },
    },
    scroll: {
        quill: {
            DebtToken: {
                address: "0x6F2A1A886Dbf8E36C4fa9F25a517861A930fBF3A",
                startBlock: 12913278,
            },
        },
    },
};
