import { useMemo } from "react";
import type { UseIsChainSupportedParams } from "./types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { APTOS_NETWORK_ID } from "../use-chain-id/useChainIdMvm";

export function useIsChainSupportedMvm({
    chainId,
    enabled,
}: UseIsChainSupportedParams) {
    const { network, connected } = useWallet();

    return useMemo(() => {
        if (!connected || !network || !enabled) return true;

        return !!network && !!APTOS_NETWORK_ID[network.name];
    }, [connected, network, enabled, chainId]);
}
