import { useNetwork } from "@aptos-labs/react";
import { Network } from "@aptos-labs/ts-sdk";

// FIXME: not ideal
export const APTOS_NETWORK_ID: Record<Network, number> = {
    [Network.LOCAL]: 0,
    [Network.CUSTOM]: 0,
    [Network.DEVNET]: 195,
    [Network.TESTNET]: 2,
    [Network.MAINNET]: 1,
};

export function useChainIdMvm() {
    const { network } = useNetwork();
    return APTOS_NETWORK_ID[network];
}
