export enum SupportedNetwork {
    Gnosis = "gnosis",
}

export enum SupportedAmm {
    Swapr = "swapr",
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
    [SupportedNetwork.Gnosis]: {
        [SupportedAmm.Swapr]: {
            Factory: {
                address: "0xA0864cCA6E114013AB0e27cbd5B6f4c8947da766",
                startBlock: 30_096_645,
            },
            NonFungiblePositionManager: {
                address: "0x91fd594c46d8b01e62dbdebed2401dde01817834",
                startBlock: 30_096_660,
            },
        },
    },
};
