import { useChainId as useChainIdWagmi } from "wagmi";
import { useNetwork } from "@aptos-labs/react";
import { aptosNetworkToId, solanaNetworkToId } from "@/src/utils/chain";
import type { ChainWithType } from "../types/chain";
import { ChainType } from "@metrom-xyz/sdk";
import { useSolanaClient } from "@solana/react-hooks";
import { useChainType } from "./useChainType";

export function useChainWithType(): ChainWithType {
    const chainType = useChainType();
    const chainIdEvm = useChainIdWagmi();
    const networkMvm = useNetwork();
    const solanaClient = useSolanaClient();

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
        case ChainType.Svm:
            return {
                id: solanaNetworkToId(solanaClient.config.cluster),
                type: ChainType.Svm,
            };
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useChainWithType`,
            );
    }
}
