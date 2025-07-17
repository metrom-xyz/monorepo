import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccount as useAccountWagmi } from "wagmi";
import { APTOS } from "@/src/commons/env";
import type { Address } from "viem";

export interface UseAccountReturnValue {
    address?: Address;
    chainId?: number;
    connected: boolean;
}

export function useAccount(): UseAccountReturnValue {
    const accountEvm = useAccountWagmi();
    const accountMvm = useWallet();

    if (APTOS)
        return {
            address: accountMvm.account?.address.toString(),
            chainId: accountMvm.network?.chainId,
            connected: accountMvm.connected,
        };
    return {
        address: accountEvm.address,
        chainId: accountEvm.chainId,
        connected: accountEvm.isConnected,
    };
}
