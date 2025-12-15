import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    Environment,
    type ChainData,
    SupportedDevelopmentEvmChain,
    SupportedProductionEvmChain,
    SupportedDevelopmentMvmChain,
    SupportedProductionMvmChain,
} from "@metrom-xyz/chains";
import { APTOS, ENVIRONMENT } from "../commons/env";
import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import { ChainType } from "@metrom-xyz/sdk";

export const APTOS_NETWORK_ID = {
    [Environment.Development]: {
        [Network.MAINNET]: NetworkToChainId[Network.MAINNET],
        [Network.TESTNET]: NetworkToChainId[Network.TESTNET],
    },
    [Environment.Production]: {
        [Network.MAINNET]: NetworkToChainId[Network.MAINNET],
    },
};

export function aptosNetworkToId(network: string): number {
    return NetworkToChainId[network];
}

export function chainIdToAptosNetwork(
    chainId?: number,
): SupportedChainMvm | null {
    const chain = Object.entries(APTOS_NETWORK_ID[ENVIRONMENT]).find(
        ([, id]) => chainId === id,
    );

    if (!chain) return null;
    return chain[0] as SupportedChainMvm;
}

export function getCrossVmChainData(
    chainId: number,
    chainType: ChainType,
): ChainData | undefined {
    let chainData: ChainData | undefined;

    switch (ENVIRONMENT) {
        case Environment.Development: {
            chainData =
                chainType === ChainType.Aptos
                    ? MVM_CHAIN_DATA[Environment.Development][
                          chainIdToAptosNetwork(
                              chainId,
                          ) as unknown as SupportedDevelopmentMvmChain
                      ]
                    : EVM_CHAIN_DATA[Environment.Development][
                          chainId as SupportedDevelopmentEvmChain
                      ];

            break;
        }
        case Environment.Production: {
            chainData =
                chainType === ChainType.Aptos
                    ? MVM_CHAIN_DATA[Environment.Production][
                          chainIdToAptosNetwork(
                              chainId,
                          ) as unknown as SupportedProductionMvmChain
                      ]
                    : EVM_CHAIN_DATA[Environment.Production][
                          chainId as SupportedProductionEvmChain
                      ];

            break;
        }
        default: {
            throw new Error(`Unsupported environment ${ENVIRONMENT}`);
        }
    }

    return chainData;
}

export function getChainData(chainId: number): ChainData | undefined {
    let chainData: ChainData | undefined;

    switch (ENVIRONMENT) {
        case Environment.Development: {
            if (APTOS)
                chainData =
                    MVM_CHAIN_DATA[Environment.Development][
                        chainIdToAptosNetwork(
                            chainId,
                        ) as unknown as SupportedDevelopmentMvmChain
                    ];
            else
                chainData =
                    EVM_CHAIN_DATA[Environment.Development][
                        chainId as SupportedDevelopmentEvmChain
                    ];

            break;
        }
        case Environment.Production: {
            if (APTOS)
                chainData =
                    MVM_CHAIN_DATA[Environment.Production][
                        chainIdToAptosNetwork(
                            chainId,
                        ) as unknown as SupportedProductionMvmChain
                    ];
            else
                chainData =
                    EVM_CHAIN_DATA[Environment.Production][
                        chainId as SupportedProductionEvmChain
                    ];

            break;
        }
        default: {
            throw new Error(`Unsupported environment ${ENVIRONMENT}`);
        }
    }

    return chainData;
}

export function getChainDataBySlug(slug: string): ChainData | undefined {
    let chainData: ChainData | undefined;

    switch (ENVIRONMENT) {
        case Environment.Development: {
            if (APTOS)
                chainData = Object.values(
                    MVM_CHAIN_DATA[Environment.Development],
                ).find((data) => data.slug === slug);
            else
                chainData = Object.values(
                    EVM_CHAIN_DATA[Environment.Development],
                ).find((data) => data.slug === slug);
            break;
        }
        case Environment.Production: {
            if (APTOS)
                chainData = Object.values(
                    MVM_CHAIN_DATA[Environment.Production],
                ).find((data) => data.slug === slug);
            else
                chainData = Object.values(
                    EVM_CHAIN_DATA[Environment.Production],
                ).find((data) => data.slug === slug);

            break;
        }
        default: {
            throw new Error(`Unsupported environment ${ENVIRONMENT}`);
        }
    }

    return chainData;
}
