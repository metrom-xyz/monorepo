export interface Contract {
    address: string;
    startBlock: number;
}

export interface ChainConfig {
    Vault: Contract;
    RewardTrackerAddress: string;
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    // "lightlink-phoenix": {
    //     Vault: {
    //         address: "0xa6b88069EDC7a0C2F062226743C8985FF72bB2Eb",
    //         startBlock: 85247813,
    //     },
    // },
    sonic: {
        Vault: {
            address: "0x5B8caae7cC6Ea61fb96Fd251C4Bc13e48749C7Da",
            startBlock: 8181381,
        },
        RewardTrackerAddress: "0xB895e3DBFB37A4Cc6b4FB50B1cf903608e942FF9",
    },
};
