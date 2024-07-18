export interface ChainConfig {
    Factory: {
        address: string;
        startBlock: number;
    };
    NonFungiblePositionManager: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: { [amm: string]: ChainConfig };
} = {
    holesky: {
        "test-integral": {
            Factory: {
                address: "0x6AD6A4f233F1E33613e996CCc17409B93fF8bf5f",
                startBlock: 1070314,
            },
            NonFungiblePositionManager: {
                address: "0x5AeFBA317BAba46EAF98Fd6f381d07673bcA6467",
                startBlock: 1070336,
            },
        },
    },
    "mantle-sepolia": {
        swapsicle: {
            Factory: {
                address: "0x10253594A832f967994b44f33411940533302ACb",
                startBlock: 4909023,
            },
            NonFungiblePositionManager: {
                address: "0x0BFaCE9a5c9F884a4f09fadB83b69e81EA41424B",
                startBlock: 4909108,
            },
        },
    },
};
