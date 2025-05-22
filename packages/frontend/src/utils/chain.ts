import {
    CHAIN_DATA,
    Environment,
    SupportedDevelopmentChain,
    SupportedProductionChain,
    type ChainData,
} from "@metrom-xyz/chains-data";
import { ENVIRONMENT } from "../commons/env";

export function getChainData(chainId: number): ChainData {
    switch (ENVIRONMENT) {
        case Environment.Development: {
            return CHAIN_DATA[Environment.Development][
                chainId as SupportedDevelopmentChain
            ];
        }
        case Environment.Production: {
            return CHAIN_DATA[Environment.Production][
                chainId as SupportedProductionChain
            ];
        }
        default: {
            throw new Error(`Missing chain data for chain with id ${chainId}`);
        }
    }
}
