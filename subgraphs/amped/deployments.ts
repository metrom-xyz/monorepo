interface Contract {
    address: string;
    startBlock: number;
}

interface AutomatedVault extends Contract {
    collateral: string;
}

interface ChainConfig {
    Vault: Contract;
    GlpManager: Contract;
    tokenizedVaults: AutomatedVault[];
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
        tokenizedVaults: [],
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
        tokenizedVaults: [
            // Wrapped sonic
            {
                address: "0xFa9A3A721BA614C589Dcd6062578123f998d3A34",
                startBlock: 33453126,
                collateral: "0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38",
            },
        ],
    },
};
