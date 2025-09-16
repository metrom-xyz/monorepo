export interface ChainConfig {
    pruningBlocks?: number;
    Factory: {
        address: string;
        startBlock: number;
    };
    LiquidityManager: {
        address: string;
        startBlock: number;
    };
}

const TWO_WEEKS_SECONDS = 60 * 60 * 24 * 14;

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    taiko: {
        // taiko has a 12 secs block production rate, we are aiming for 2 weeks of
        // data retained
        pruningBlocks: TWO_WEEKS_SECONDS / 12,
        Factory: {
            address: "0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08",
            startBlock: 590,
        },
        LiquidityManager: {
            address: "0x33531bDBFE34fa6Fd5963D0423f7699775AacaaF",
            startBlock: 622,
        },
    },
};
