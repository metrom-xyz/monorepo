import { useMemo } from "react";
import { useAccount, useChains } from "wagmi";
import type { UseIsChainSupportedParams } from ".";

export function useIsChainSupportedEvm({
    chainId,
    enabled,
}: UseIsChainSupportedParams) {
    const supportedChains = useChains();
    const { chain: connectedChain, isConnected } = useAccount();

    return useMemo(() => {
        if (!isConnected || !enabled) return true;

        return (
            !!connectedChain &&
            !!supportedChains.some(({ id }) => id === chainId)
        );
    }, [supportedChains, enabled, connectedChain, isConnected, chainId]);
}
