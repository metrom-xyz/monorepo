export interface ChainConfig {
    GlpManager: {
        address: string;
        startBlock: number;
    };
}

export const DEPLOYMENTS: {
    [network: string]: ChainConfig;
} = {
    sonic: {
        GlpManager: {
            address: "0x4DE729B85dDB172F1bb775882f355bA25764E430",
            startBlock: 8181671,
        },
    },
};
