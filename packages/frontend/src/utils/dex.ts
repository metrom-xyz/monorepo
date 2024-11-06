import { SupportedDex, type Pool } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import type { Dex } from "../types";
import { CHAIN_DATA } from "../commons";
import type { Hex } from "viem";
import type { Address } from "blo";

export function getDex(
    chainId: SupportedChain,
    dexSlug: string,
): Dex | undefined {
    return CHAIN_DATA[chainId].dexes.find((dex) => dex.slug === dexSlug);
}

export function getPoolAddLiquidityLink(
    chainId: SupportedChain,
    dexSlug: string,
    pool: Pool,
): string | undefined {
    const dex = getDex(chainId, dexSlug);
    if (!dex || !dex.addLiquidityUrl) return;

    if (dex.slug === SupportedDex.UniswapV3)
        return dex.addLiquidityUrl.replace(
            "{target_pool}",
            `${pool.tokens.map((token) => token.address).join("/")}`,
        );

    return dex.addLiquidityUrl.replace("{target_pool}", `${pool.address}`);
}

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
