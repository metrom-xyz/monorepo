import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccount as useAccountWagmi } from "wagmi";
import type { UseAccountReturnValue } from "./types";
import { APTOS } from "@/src/commons/env";

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
