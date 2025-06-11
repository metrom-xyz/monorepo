interface Contract {
    address: string;
    startBlock: number;
}

interface ChainConfig {
    Vault: Contract;
    GlpManager: Contract;
    yAlpVault: Contract | null;
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    lightlink: {
        Vault: {
            address: "0xa6b88069EDC7a0C2F062226743C8985FF72bB2Eb",
            startBlock: 85247813,
        },
        GlpManager: {
            address: "0xEF301eD9eAFf7476605aE8C8A7b966c0fbE77530",
            startBlock: 85247896,
        },
        yAlpVault: null,
    },
    sonic: {
        Vault: {
            address: "0x5B8caae7cC6Ea61fb96Fd251C4Bc13e48749C7Da",
            startBlock: 8181381,
        },
        GlpManager: {
            address: "0x4DE729B85dDB172F1bb775882f355bA25764E430",
            startBlock: 8181671,
        },
        yAlpVault: {
            address: "0x2696351e079b1F411f5e6204C54a3C2dDdbE8097",
            startBlock: 30157094,
        },
    },
};
