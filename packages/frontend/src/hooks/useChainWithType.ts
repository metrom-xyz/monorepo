import { useChainId as useChainIdWagmi } from "wagmi";
import { useNetwork } from "@aptos-labs/react";
import {
    aptosNetworkToId,
    solanaNetworkToId,
    suiNetworkToId,
} from "@/src/utils/chain";
import type { ChainWithType } from "../types/chain";
import { ChainType } from "@metrom-xyz/sdk";
import { useSolanaClient } from "@solana/react-hooks";
import { useChainType } from "./useChainType";
import { useCurrentNetwork } from "@mysten/dapp-kit-react";

export function useChainWithType(): ChainWithType {
    const chainType = useChainType();
    const chainIdEvm = useChainIdWagmi();
    const networkMvm = useNetwork();
    const solanaClient = useSolanaClient();
    const networkSui = useCurrentNetwork();

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
        case ChainType.Sui:
            return {
                id: suiNetworkToId(networkSui),
                type: ChainType.Sui,
            };
        default:
            throw new Error(
                `Unsupported chain type ${chainType} in useChainWithType`,
            );
    }
}
