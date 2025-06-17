import {
    CHAIN_DATA,
    Environment,
    SupportedDevelopmentChain,
    SupportedProductionChain,
    type ChainData,
} from "@metrom-xyz/chains";
import { ENVIRONMENT } from "../commons/env";

export function getChainData(chainId: number): ChainData | undefined {
    let chainData: ChainData | undefined;

    switch (ENVIRONMENT) {
        case Environment.Development: {
            chainData =
                CHAIN_DATA[Environment.Development][
                    chainId as SupportedDevelopmentChain
                ];
            break;
        }
        case Environment.Production: {
            chainData =
                CHAIN_DATA[Environment.Production][
                    chainId as SupportedProductionChain
                ];
            break;
        }
        default: {
            throw new Error(`Unsupported environment ${ENVIRONMENT}`);
        }
    }

    return chainData;
}
