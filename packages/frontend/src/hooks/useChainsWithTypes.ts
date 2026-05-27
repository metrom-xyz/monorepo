import { SUPPORTED_CHAINS_MVM, SUPPORTED_CHAINS_SVM } from "@/src/commons";
import { ChainType } from "@metrom-xyz/sdk";
import { getChains } from "@wagmi/core";
import { useConfig } from "wagmi";
import type { ChainWithType } from "../types/chain";

interface UseChainsWithTypesParams {
    chainType?: ChainType;
}

export function useChainsWithTypes({
    chainType,
}: UseChainsWithTypesParams = {}): ChainWithType[] {
    const config = useConfig();

    const chains = getChains(config)
        .map(({ id }) => ({ id, type: ChainType.Evm }))
        .concat(
            SUPPORTED_CHAINS_MVM.map((id) => ({
                id,
                type: ChainType.Aptos,
            })),
        )
        .concat(
            SUPPORTED_CHAINS_SVM.map((id) => ({
                id,
                type: ChainType.Svm,
            })),
        );

    if (chainType) return chains.filter(({ type }) => type === chainType);
    return chains;
}
