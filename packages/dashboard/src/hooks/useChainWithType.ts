import { useChainId as useChainIdWagmi } from "wagmi";
import { useNetwork } from "@aptos-labs/react";
import { ChainType } from "@metrom-xyz/sdk";
import { aptosNetworkToId } from "../utils/chain";
import { useChainType } from "../context/chain-type";
import type { ChainWithType } from "../types/chain";

export function useChainWithType(): ChainWithType {
    const { chainType } = useChainType();
    const chainIdEvm = useChainIdWagmi();
    const networkMvm = useNetwork();

    switch (chainType) {
        case ChainType.Evm:
            return {
                id: chainIdEvm,
                type: ChainType.Evm,
            };
        case ChainType.Aptos:
            return {
                id: aptosNetworkToId(networkMvm.network),
                type: ChainType.Aptos,
            };
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}
