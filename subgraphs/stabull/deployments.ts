export interface ChainConfig {
    CurveFactoryV2: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: { [network: string]: ChainConfig } = {
    base: {
        CurveFactoryV2: {
            address: "0x86Ba17ebf8819f7fd32Cf1A43AbCaAe541A5BEbf",
            startBlock: 32424817,
        },
    },
};
