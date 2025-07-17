export interface ChainConfig {
    Factory: {
        address: string;
        startBlock: number;
    };
    NonFungiblePositionManager: {
        address: string;
        startBlock: number;
    };
    stakingContractAddresses?: string[];
}

export const DEPLOYMENTS: {
    [network: string]: { [amm: string]: ChainConfig };
} = {
    taiko: {
        panko: {
            Factory: {
                address: "0x99960D7076297a1E0C86f3cc60FfA5d6f2B507B5",
                startBlock: 433329,
            },
            NonFungiblePositionManager: {
                address: "0xbbD6db7cDb3C3a0Ce26c89918D7ce99FB2d403aF",
                startBlock: 433334,
            },
            stakingContractAddresses: [
                // Masterchef V3
                "0x2E47e7e2d7A75D1473995441BbcE7888DC035E74",
            ],
        },
    },
    lumia: {
        morphex: {
            Factory: {
                address: "0x69bCd7daCEe8789dc923D09E5b76135fe0fb95f9",
                startBlock: 4581818,
            },
            NonFungiblePositionManager: {
                address: "0x2F91EECCc3c73a6D90E88576C9a070Be71aeC31F",
                startBlock: 4581905,
            },
            stakingContractAddresses: [
                // Masterchef V3s
                "0x01a441e7c15da925d0f3444cdadcaa34ad3026bc",
                "0x1e016022d93cf86c3d9e38c50b0adb909047830d",
            ],
        },
    },
};
