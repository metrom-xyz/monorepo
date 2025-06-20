import { useMemo } from "react";
import { useAccount, useChains } from "wagmi";

export function useIsChainSupported(chainId?: number) {
    const supportedChains = useChains();
    const { chain: connectedChain, isConnected } = useAccount();

    return useMemo(() => {
        if (!isConnected) return true;

        return (
            !!connectedChain &&
            !!supportedChains.some(({ id }) => id === chainId)
        );
    }, [supportedChains, connectedChain, isConnected, chainId]);
}
