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
import { Network } from "@aptos-labs/ts-sdk";

export const APTOS_NETWORK_ID: Record<Network, number> = {
    [Network.LOCAL]: 0,
    [Network.CUSTOM]: 0,
    // FIXME: devnet id is dynamic
    [Network.DEVNET]: 197,
    [Network.TESTNET]: 2,
    [Network.MAINNET]: 1,
};

export function aptosNetworkToId(network: Network): number {
    return APTOS_NETWORK_ID[network];
}

export function chainIdToAptosNetwork(chainId?: number): Network | null {
    const chain = Object.entries(APTOS_NETWORK_ID).find(
        ([, id]) => chainId === id,
    );

    if (!chain) return null;
    return chain[0] as Network;
}

// FIXME: how to differentiate between eth mainnet and aptos mainnet, since they both have id 1
export function getCrossVmChainData(chainId: number): ChainData | undefined {
    let chainData: ChainData | undefined;

    switch (ENVIRONMENT) {
        case Environment.Development: {
            chainData =
                MVM_CHAIN_DATA[Environment.Development][
                    chainId as SupportedDevelopmentMvmChain
                ] ||
                EVM_CHAIN_DATA[Environment.Development][
                    chainId as SupportedDevelopmentEvmChain
                ];

            break;
        }
        case Environment.Production: {
            chainData =
                MVM_CHAIN_DATA[Environment.Production][
                    chainId as SupportedProductionMvmChain
                ] ||
                EVM_CHAIN_DATA[Environment.Production][
                    chainId as SupportedProductionMvmChain
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
                        chainId as SupportedDevelopmentMvmChain
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
                        chainId as SupportedProductionMvmChain
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
