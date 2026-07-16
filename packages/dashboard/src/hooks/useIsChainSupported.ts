import { useMemo } from "react";
import { useAccount, useChains } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChainType } from "@metrom-xyz/sdk";
import { chainIdToAptosNetwork } from "../utils/chain";
import { useChainType } from "../context/chain-type";

export function useIsChainSupported(chainId?: number) {
    const { chainType } = useChainType();
    const supportedChains = useChains();
    const { chain: connectedChain, isConnected } = useAccount();
    const { connected: connectedMvm } = useWallet();

    return useMemo(() => {
        switch (chainType) {
            case ChainType.Evm: {
                if (!isConnected) return true;

                return (
                    !!connectedChain &&
                    !!supportedChains.some(({ id }) => id === chainId)
                );
            }
            case ChainType.Aptos:
                return !connectedMvm || !!chainIdToAptosNetwork(chainId);
            default: {
                throw new Error(`Unsupported chain type: ${chainType}`);
            }
        }
    }, [
        chainType,
        supportedChains,
        connectedChain,
        isConnected,
        connectedMvm,
        chainId,
    ]);
}
