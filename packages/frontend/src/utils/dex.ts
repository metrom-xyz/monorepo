import { SupportedChain } from "@metrom-xyz/contracts";
import { CHAIN_DATA } from "../commons";
import type { Hex } from "viem";
import type { Address } from "blo";

export function getAddressExplorerLink(
    address: Address,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return;

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
