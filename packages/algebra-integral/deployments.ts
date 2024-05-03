export enum SupportedNetwork {
    Holesky = "holesky",
}

export enum SupportedAmm {
    TestIntegral = "test-integral",
}

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

export const DEPLOYMENTS: Record<
    SupportedNetwork,
    Record<SupportedAmm, ChainConfig>
> = {
    [SupportedNetwork.Holesky]: {
        [SupportedAmm.TestIntegral]: {
            Factory: {
                address: "0x6AD6A4f233F1E33613e996CCc17409B93fF8bf5f",
                startBlock: 1_070_314,
            },
            NonFungiblePositionManager: {
                address: "0x5AeFBA317BAba46EAF98Fd6f381d07673bcA6467",
                startBlock: 1_070_336,
            },
        },
    },
};
