interface Contract {
    address: string;
    startBlock: number;
}

interface ChainConfig {
    Vault: Contract;
    GlpManager: Contract;
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    sonic: {
        Vault: {
            address: "0x5B8caae7cC6Ea61fb96Fd251C4Bc13e48749C7Da",
            startBlock: 8181381,
        },
        GlpManager: {
            address: "0x4DE729B85dDB172F1bb775882f355bA25764E430",
            startBlock: 8181671,
        },
    },
};
