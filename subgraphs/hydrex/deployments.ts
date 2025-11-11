export interface ChainConfig {
    Factory: {
        address: string;
        startBlock: number;
    };
    NonFungiblePositionManager: {
        address: string;
        startBlock: number;
    };
    Voter: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: { [network: string]: ChainConfig } = {
    base: {
        Factory: {
            address: "0x36077D39cdC65E1e3FB65810430E5b2c4D5fA29E",
            startBlock: 31648963,
        },
        NonFungiblePositionManager: {
            address: "0xC63E9672f8e93234C73cE954a1d1292e4103Ab86",
            startBlock: 31649041,
        },
        Voter: {
            address: "0xc69E3eF39E3fFBcE2A1c570f8d3ADF76909ef17b",
            startBlock: 35273810,
        },
    },
};
