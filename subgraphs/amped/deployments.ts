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
