import { SupportedChain } from "@metrom-xyz/contracts";
import { type Hex, isAddress } from "viem";
import type { Address } from "blo";
import { getChainData } from "./chain";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export function getExplorerLink(
    address: Address,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId || (!isAddress(address) && !AccountAddress.isValid(address)))
        return undefined;

    const explorer = getChainData(chainId)?.blockExplorers?.default;

    if (!explorer) return undefined;

    return `${explorer.url}/address/${address}`;
}

export function getTxExplorerLink(
    hash: Hex,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = getChainData(chainId)?.blockExplorers?.default;
    if (!explorer) return;

    return `${explorer.url}/tx/${hash}`;
}
