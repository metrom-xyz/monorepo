import { SupportedChain } from "@metrom-xyz/contracts";
import { type Hex } from "viem";
import type { Address } from "blo";
import {
    chainIdToAptosNetwork,
    getChainData,
    getCrossVmChainData,
} from "./chain";
import { APTOS } from "../commons/env";
import { getAddressChainType, isAddress } from "./address";
import { ChainType } from "@metrom-xyz/sdk";

export function getExplorerLink(
    address: Address,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId || !isAddress(address)) return undefined;

    const explorer = getCrossVmChainData(chainId)?.blockExplorers?.default;
    if (!explorer) return undefined;

    const addressChainType = getAddressChainType(address);
    if (!addressChainType) return undefined;

    if (addressChainType === ChainType.Aptos) {
        const network = chainIdToAptosNetwork(chainId);
        return `${explorer.url}/account/${address}?network=${network}`;
    }
    return `${explorer.url}/address/${address}`;
}

export function getTxExplorerLink(
    hash: Hex,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = getChainData(chainId)?.blockExplorers?.default;
    if (!explorer) return;

    if (APTOS) {
        const network = chainIdToAptosNetwork(chainId);
        return `${explorer.url}/txn/${hash}?network=${network}`;
    }
    return `${explorer.url}/tx/${hash}`;
}
