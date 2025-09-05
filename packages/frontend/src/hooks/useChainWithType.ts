import { useChainId as useChainIdWagmi } from "wagmi";
import { APTOS } from "@/src/commons/env";
import { useNetwork } from "@aptos-labs/react";
import { aptosNetworkToId } from "@/src/utils/chain";
import type { ChainWithType } from "../types/chain";
import { ChainType } from "@metrom-xyz/sdk";

export function useChainWithType(): ChainWithType {
    const chainIdEvm = useChainIdWagmi();
    const networkMvm = useNetwork();

    if (APTOS)
        return {
            id: aptosNetworkToId(networkMvm.network),
            type: ChainType.Aptos,
        };
    return {
        id: chainIdEvm,
        type: ChainType.Evm,
    };
}
