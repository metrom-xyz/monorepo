interface Contract {
    address: string;
    startBlock: number;
}

interface ChainConfig {
    PoolFactory: Contract;
    ClFactory: Contract;
    NonFungiblePositionManager: Contract;
    Voter: Contract;
    AlmCoreAddress: string | null;
}

export const DEPLOYMENTS: {
    [network: string]: { [amm: string]: ChainConfig };
} = {
    swellchain: {
        velodrome: {
            PoolFactory: {
                address: "0x31832f2a97Fd20664D76Cc421207669b55CE4BC0",
                startBlock: 3717905,
            },
            ClFactory: {
                address: "0x04625B046C69577EfC40e6c0Bb83CDBAfab5a55F",
                startBlock: 3717905,
            },
            NonFungiblePositionManager: {
                address: "0x991d5546C4B442B4c5fdc4c8B8b8d131DEB24702",
                startBlock: 3718342,
            },
            Voter: {
                address: "0x97cDBCe21B6fd0585d29E539B1B99dAd328a1123",
                startBlock: 3717934,
            },
            AlmCoreAddress: null,
        },
    },
};
