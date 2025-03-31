import { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_DATA } from "../commons";
import { type Hex, isAddress } from "viem";
import type { Address } from "blo";

export function getExplorerLink(
    address: Address,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId || !isAddress(address)) return undefined;

    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return undefined;

    return `${explorer.url}/address/${address}`;
}

export function getTxExplorerLink(
    hash: Hex,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return;

    return `${explorer.url}/tx/${hash}`;
}
