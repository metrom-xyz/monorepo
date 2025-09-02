import { SupportedChain } from "@metrom-xyz/contracts";
import { type Hex, isAddress } from "viem";
import type { Address } from "blo";
import { chainIdToAptosNetwork, getChainData } from "./chain";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { APTOS } from "../commons/env";

export function getExplorerLink(
    address: Address,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId || (!isAddress(address) && !AccountAddress.isValid(address)))
        return undefined;

    const explorer = getChainData(chainId)?.blockExplorers?.default;

    if (!explorer) return undefined;

    if (APTOS) {
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
