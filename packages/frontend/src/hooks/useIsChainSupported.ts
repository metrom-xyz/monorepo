import type { HookBaseParams } from "@/src/types/hooks";
import { useAccount, useChains } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMemo } from "react";
import {
    chainIdToAptosNetwork,
    chainIdToSolanaNetwork,
    chainIdToSuiNetwork,
} from "@/src/utils/chain";
import { useChainType } from "./useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useWalletConnection } from "@solana/react-hooks";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

export interface UseIsChainSupportedParams extends HookBaseParams {
    chainId?: number;
}

export function useIsChainSupported({ chainId }: UseIsChainSupportedParams) {
    const chainType = useChainType();
    const accountEvm = useAccount();
    const accountMvm = useWallet();
    const accountSvm = useWalletConnection();
    const accountSui = useCurrentAccount();
    const supportedChainsEvm = useChains();

    return useMemo(() => {
        switch (chainType) {
            case ChainType.Evm:
                return (
                    !accountEvm.isConnected ||
                    (!!accountEvm.chain &&
                        supportedChainsEvm.some(({ id }) => id === chainId))
                );
            case ChainType.Aptos:
                return (
                    !accountMvm.connected || !!chainIdToAptosNetwork(chainId)
                );
            case ChainType.Svm:
                return (
                    !accountSvm.connected || !!chainIdToSolanaNetwork(chainId)
                );
            case ChainType.Sui:
                return !accountSui || !!chainIdToSuiNetwork(chainId);
            default:
                throw new Error(
                    `Unsupported chain type ${chainType} in useIsChainSupported`,
                );
        }
    }, [
        chainType,
        accountEvm,
        accountMvm.connected,
        accountSvm.connected,
        accountSui,
        supportedChainsEvm,
        chainId,
    ]);
}
