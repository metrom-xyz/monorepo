import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccount as useAccountWagmi } from "wagmi";
import type { Address } from "viem";
import { useChainType } from "./useChainType";
import { ChainType } from "@metrom-xyz/sdk";
import { useWalletConnection, useSolanaClient } from "@solana/react-hooks";
import { useCurrentAccount, useCurrentNetwork } from "@mysten/dapp-kit-react";
import { solanaNetworkToId, suiNetworkToId } from "../utils/chain";

export interface UseAccountReturnValue {
    address?: Address;
    chainId?: number;
    connected: boolean;
}

export function useAccount(): UseAccountReturnValue {
    const chainType = useChainType();
    const accountEvm = useAccountWagmi();
    const accountMvm = useWallet();
    const accountSvm = useWalletConnection();
    const solanaClient = useSolanaClient();
    const accountSui = useCurrentAccount();
    const networkSui = useCurrentNetwork();

    switch (chainType) {
        case ChainType.Evm:
            return {
                address: accountEvm.address,
                chainId: accountEvm.chainId,
                connected: accountEvm.isConnected,
            };
        case ChainType.Aptos:
            return {
                address: accountMvm.account?.address.toString(),
                chainId: accountMvm.network?.chainId,
                connected: accountMvm.connected,
            };
        case ChainType.Svm:
            return {
                address: accountSvm.wallet?.account.address as Address,
                // Solana chain is controlled by the client configuration
                chainId: solanaNetworkToId(solanaClient.config.cluster),
                connected: accountSvm.connected,
            };
        case ChainType.Sui:
            return {
                address: accountSui?.address as Address,
                chainId: suiNetworkToId(networkSui),
                connected: !!accountSui,
            };
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useAccount`,
            );
    }
}
