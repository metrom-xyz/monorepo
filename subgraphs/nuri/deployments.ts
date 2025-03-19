interface Contract {
    address: string;
    startBlock: number;
}

interface ChainConfig {
    PairFactory: Contract;
    Factory: Contract;
    NonFungiblePositionManager: Contract;
    Voter: Contract;
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    scroll: {
        PairFactory: {
            address: "0xAAA16c016BF556fcD620328f0759252E29b1AB57",
            startBlock: 3375209,
        },
        Factory: {
            address: "0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42",
            startBlock: 3375212,
        },
        NonFungiblePositionManager: {
            address: "0xAAA78E8C4241990B4ce159E105dA08129345946A",
            startBlock: 3375212,
        },
        Voter: {
            address: "0xAAAf3D9CDD3602d117c67D80eEC37a160C8d9869",
            startBlock: 3375209,
        },
    },
};
