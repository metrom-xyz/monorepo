import type { HookBaseParams } from "@/src/types/hooks";
import { APTOS } from "@/src/commons/env";
import { useAccount, useChains } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMemo } from "react";
import { chainIdToAptosNetwork } from "@/src/utils/chain";

export interface UseIsChainSupportedParams extends HookBaseParams {
    chainId?: number;
}

export function useIsChainSupported({ chainId }: UseIsChainSupportedParams) {
    const supportedChainsEvm = useChains();
    const { chain: connectedChainEvm, isConnected: connectedEvm } =
        useAccount();
    const accountMvm = useWallet();

    const supportedEvm = useMemo(() => {
        if (APTOS || !connectedEvm) return true;
        return (
            !!connectedChainEvm &&
            !!supportedChainsEvm.some(({ id }) => id === chainId)
        );
    }, [supportedChainsEvm, connectedChainEvm, connectedEvm, chainId]);

    const supportedMvm = useMemo(() => {
        if (!APTOS || !accountMvm.connected) return true;
        return !!chainIdToAptosNetwork(chainId);
    }, [accountMvm.connected, chainId]);

    if (APTOS) return supportedMvm;
    return supportedEvm;
}
