import { SupportedDex, type Pool } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import type { Dex } from "../types";
import { CHAIN_DATA } from "../commons";
import type { Hex } from "viem";

export const getDex = (
    chainId: SupportedChain,
    dexSlug: string,
): Dex | undefined => {
    return CHAIN_DATA[chainId].dexes.find((dex) => dex.slug === dexSlug);
};

export const getPoolAddLiquidityLink = (
    chainId: SupportedChain,
    dexSlug: string,
    pool: Pool,
): string | undefined => {
    const dex = getDex(chainId, dexSlug);
    if (!dex || !dex.addLiquidityUrl) return;

    if (dex.slug === SupportedDex.Univ3)
        return dex.addLiquidityUrl.replace(
            "{target_pool}",
            `${pool.tokens.map((token) => token.address).join("/")}`,
        );

    return dex.addLiquidityUrl.replace("{target_pool}", `${pool.address}`);
};

export const getPoolExplorerLink = (
    chainId: SupportedChain,
    pool: Pool,
): string | undefined => {
    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return;

    return `${explorer.url}/address/${pool.address}`;
};

export const getTxExplorerLink = (
    chainId: SupportedChain,
    hash: Hex,
): string | undefined => {
    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return;

    return `${explorer.url}/tx/${hash}`;
};
