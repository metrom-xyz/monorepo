export interface Contract {
    address: string;
    startBlock: number;
}

export interface ChainConfig {
    GlpManager: Contract;
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
        GlpManager: {
            address: "0x4DE729B85dDB172F1bb775882f355bA25764E430",
            startBlock: 8181671,
        },
        RewardTrackerAddress: "0xB895e3DBFB37A4Cc6b4FB50B1cf903608e942FF9",
    },
};
