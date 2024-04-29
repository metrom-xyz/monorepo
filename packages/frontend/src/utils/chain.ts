import { SUPPORTED_CHAINS } from "@/commons";

export const isChainSupported = (chainId: number) => {
    return SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
};
