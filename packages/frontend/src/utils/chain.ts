import { SUPPORTED_CHAINS } from "@/commons";

export const isChainSupported = (chainId: number | string) => {
    return SUPPORTED_CHAINS.find((chain) => chain.id === Number(chainId));
};
