import { aptosNetworkToId } from "@/src/utils/chain";
import { useNetwork } from "@aptos-labs/react";

export function useChainIdMvm() {
    const { network } = useNetwork();
    return aptosNetworkToId(network);
}
