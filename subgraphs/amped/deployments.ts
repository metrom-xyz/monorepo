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
    RewardRouterV2: Contract;
    ALP: Contract;
    fALP: string;
    fsALP: string;
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
        RewardRouterV2: {
            address: "0xE72A2d5B3b09c88D4E8Cc60e74BD438d7168e80F",
            startBlock: 8183103,
        },
        ALP: {
            address: "0x6fbaeE8bEf2e8f5c34A08BdD4A4AB777Bd3f6764",
            startBlock: 8181610,
        },
        fALP: "0xF3d911F81c4A630e755B42C90942e278019709A7",
        fsALP: "0xB895e3DBFB37A4Cc6b4FB50B1cf903608e942FF9",
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
