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
    "base-sepolia": {
        kim: {
            Factory: {
                address: "0x2F0d41f94d5D1550b79A83D2fe85C82d68c5a3ca",
                startBlock: 10903972,
            },
            NonFungiblePositionManager: {
                address: "0xB7cF725E5b697F8338B929e6A52df823F2120a6A",
                startBlock: 10904014,
            },
        },
    },
    mantle: {
        swapsicle: {
            Factory: {
                address: "0xC848bc597903B4200b9427a3d7F61e3FF0553913",
                startBlock: 9796947,
            },
            NonFungiblePositionManager: {
                address: "0x7D24DE60A68ae47BE4E852cf03Dd4d8588B489Ec",
                startBlock: 9797112,
            },
        },
    },
    "mode-mainnet": {
        kim: {
            Factory: {
                address: "0xB5F00c2C5f8821155D8ed27E31932CFD9DB3C5D5",
                startBlock: 4823915,
            },
            NonFungiblePositionManager: {
                address: "0x2e8614625226D26180aDf6530C3b1677d3D7cf10",
                startBlock: 4823969,
            },
        },
    },
    base: {
        kim: {
            Factory: {
                address: "0x2F0d41f94d5D1550b79A83D2fe85C82d68c5a3ca",
                startBlock: 15395969,
            },
            NonFungiblePositionManager: {
                address: "0xB7cF725E5b697F8338B929e6A52df823F2120a6A",
                startBlock: 15396241,
            },
        },
    },
    scroll: {
        scribe: {
            Factory: {
                address: "0xDc62aCDF75cc7EA4D93C69B2866d9642E79d5e2e",
                startBlock: 7680915,
            },
            NonFungiblePositionManager: {
                address: "0x8b370dc23bE270a7FA78aD3803fCaAe549Ac21fc",
                startBlock: 7680956,
            },
        },
    },
};
