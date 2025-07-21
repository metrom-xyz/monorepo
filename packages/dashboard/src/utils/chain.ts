import {
    EVM_CHAIN_DATA,
    Environment,
    SupportedDevelopmentEvmChain,
    SupportedProductionEvmChain,
    type ChainData,
} from "@metrom-xyz/chains";
import { ENVIRONMENT } from "../commons/env";

// TODO: add support for Aptos
export function getChainData(chainId: number): ChainData | undefined {
    let chainData: ChainData | undefined;

    switch (ENVIRONMENT) {
        case Environment.Development: {
            chainData =
                EVM_CHAIN_DATA[Environment.Development][
                    chainId as SupportedDevelopmentEvmChain
                ];
            break;
        }
        case Environment.Production: {
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
