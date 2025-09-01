import { SUPPORTED_CHAINS_MVM } from "@/src/commons";
import { getChains } from "@wagmi/core";
import { useConfig } from "wagmi";

export function useChainIds() {
    const config = useConfig();

    return getChains(config)
        .map(({ id }) => id)
        .concat(SUPPORTED_CHAINS_MVM);
}
