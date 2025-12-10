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
                address: "0xdb9e8f82d6d45fff803161f2a5f75543972b229a",
                startBlock: 15217932,
            },
        },
    },
    swellchain: {
        orki: {
            DebtToken: {
                address: "0x0000baa0b1678229863c0a941c1056b83a1955f5",
                startBlock: 7216771,
            },
        },
    },
    mainnet: {
        ebisu: {
            DebtToken: {
                address: "0x09fD37d9AA613789c517e76DF1c53aEce2b60Df4",
                startBlock: 22639791,
            },
        },
        liquity: {
            DebtToken: {
                address: "0x6440f144b7e50D6a8439336510312d2F54beB01D",
                startBlock: 22483043,
            },
        },
    },
    "plasma-mainnet": {
        ebisu: {
            DebtToken: {
                address: "0xef7b1a03e0897c33b63159e38d779e3970c0e2fc",
                startBlock: 3617380,
            },
        },
    },
};
