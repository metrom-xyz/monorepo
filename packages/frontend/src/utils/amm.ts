import { CHAIN_DATA } from "@/commons";
import type { Amm } from "@/types";
import { SupportedChain, type Pool, SupportedAmm } from "sdk";

export const getAmm = (
    chainId: SupportedChain,
    ammSlug: string,
): Amm | undefined => {
    return CHAIN_DATA[chainId].amms.find((amm) => amm.slug === ammSlug);
};

export const getPoolAddLiquidityLink = (amm: Amm, pool: Pool): string => {
    if (amm.slug === SupportedAmm.Univ3)
        return amm.addLiquidityUrl.replace(
            "{target_pool}",
            `${pool.token0.address}/${pool.token1.address}`,
        );

    return amm.addLiquidityUrl.replace("{target_pool}", `${pool.address}`);
};

export const getPoolExplorerLink = (
    chainId: SupportedChain,
    ammSlug: string,
    pool: Pool,
): string | undefined => {
    const amm = getAmm(chainId, ammSlug);
    if (!amm || !amm.poolExplorerUrl) return;

    return amm.poolExplorerUrl.replace("{target_pool}", `${pool.address}`);
};
