interface Contract {
    address: string;
    startBlock: number;
}

interface BrandConfig {
    GaugesFactory?: Contract;
    Factory: Contract;
}

export const DEPLOYMENTS: {
    [network: string]: { [amm: string]: BrandConfig };
} = {
    base: {
        hydrex: {
            GaugesFactory: {
                address: "0xc69E3eF39E3fFBcE2A1c570f8d3ADF76909ef17b",
                startBlock: 35273810,
            },
            Factory: {
                address: "0x2b52c416F723F16e883E53f3f16435B51300280a",
                startBlock: 31733762,
            },
        },
    },
};
