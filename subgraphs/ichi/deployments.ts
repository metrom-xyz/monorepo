export interface ChainConfig {
    Factory: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: { [amm: string]: ChainConfig };
} = {
    base: {
        hydrex: {
            Factory: {
                address: "0x2b52c416F723F16e883E53f3f16435B51300280a",
                startBlock: 31733762,
            },
        },
    },
};
