import { SUPPORTED_CHAINS_MVM } from "@/src/commons";
import { ChainType } from "@metrom-xyz/sdk";
import { getChains } from "@wagmi/core";
import { useConfig } from "wagmi";
import type { ChainWithType } from "../types/chain";

export function useChainsWithTypes(): ChainWithType[] {
    const config = useConfig();

    return getChains(config)
        .map(({ id }) => ({ id, type: ChainType.Evm }))
        .concat(
            SUPPORTED_CHAINS_MVM.map((id) => ({
                id,
                type: ChainType.Aptos,
            })),
        );
}
