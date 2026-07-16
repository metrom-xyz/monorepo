import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccount as useAccountWagmi } from "wagmi";
import { ChainType } from "@metrom-xyz/sdk";
import { useChainType } from "../context/chain-type";

export interface UseAccountReturnValue {
    address?: string;
    chainId?: number;
    connected: boolean;
}

export function useAccount(): UseAccountReturnValue {
    const { chainType } = useChainType();
    const accountEvm = useAccountWagmi();
    const accountMvm = useWallet();

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
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
