import { useChainId as useChainIdWagmi } from "wagmi";
import { APTOS } from "@/src/commons/env";
import { useNetwork } from "@aptos-labs/react";
import { aptosNetworkToId } from "@/src/utils/chain";

export function useChainId() {
    const chainIdEvm = useChainIdWagmi();
    const networkMvm = useNetwork();

    if (APTOS) return aptosNetworkToId(networkMvm.network);
    return chainIdEvm;
}
