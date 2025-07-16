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
