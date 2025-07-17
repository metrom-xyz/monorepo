import { useMemo } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import type { UseIsChainSupportedParams } from ".";
import { chainIdToAptosNetwork } from "@/src/utils/chain";

export function useIsChainSupportedMvm({
    chainId,
    enabled,
}: UseIsChainSupportedParams) {
    const { connected } = useWallet();

    return useMemo(() => {
        if (!connected || !enabled) return true;

        return !!chainIdToAptosNetwork(chainId);
    }, [connected, enabled, chainId]);
}
