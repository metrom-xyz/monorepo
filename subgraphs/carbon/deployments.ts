interface Contract {
    address: string;
    startBlock: number;
}

interface AmmConfig {
    Controller: Contract;
    Voucher: Contract;
}

interface ChainConfig {
    grafting?: {
        base: string;
        block: number;
    };
    nativeToken: {
        address: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    amms: { [amm: string]: AmmConfig };
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    sepolia: {
        nativeToken: {
            address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            symbol: "ETH",
            name: "Ether",
            decimals: 18,
        },
        amms: {
            carbon: {
                Controller: {
                    address: "0x5bCA3389786385a35bca14C2D0582adC6cb2482e",
                    startBlock: 6969415,
                },
                Voucher: {
                    address: "0x59f21012B2E9BA67ce6a7605E74F945D0D4C84EA",
                    startBlock: 6969374,
                },
            },
        },
    },
    "sei-mainnet": {
        // grafting: {
        //     base: "QmUFA1a8zmQkpqcQXV3qw45MHoaoGgBZKyPe8vciaBLAtT",
        //     block: 120270795,
        // },
        nativeToken: {
            address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            symbol: "SEI",
            name: "Sei",
            decimals: 18,
        },
        amms: {
            carbon: {
                Controller: {
                    address: "0xe4816658ad10bF215053C533cceAe3f59e1f1087",
                    startBlock: 79146720,
                },
                Voucher: {
                    address: "0xA4682A2A5Fe02feFF8Bd200240A41AD0E6EaF8d5",
                    startBlock: 79146505,
                },
            },
        },
    },
};
