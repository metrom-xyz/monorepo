import { CHAIN_DATA } from "@/commons";
import { SupportedAmm, type Amm } from "@/types";
import { SupportedChain, type Pair } from "sdk";

export const getAmm = (
    chainId: SupportedChain,
    ammSlug: string,
): Amm | undefined => {
    return CHAIN_DATA[chainId].amms.find((amm) => amm.slug === ammSlug);
};

export const getPairAddLiquidityLink = (amm: Amm, pair: Pair): string => {
    if (amm.slug === SupportedAmm.Univ3)
        return amm.addLiquidityUrl.replace(
            "{target_pair}",
            `${pair.token0.address}/${pair.token1.address}`,
        );

    return amm.addLiquidityUrl.replace("{target_pair}", `${pair.address}`);
};

export const getPairExplorerLink = (
    chainId: SupportedChain,
    ammSlug: string,
    pair: Pair,
): string | undefined => {
    const amm = getAmm(chainId, ammSlug);
    if (!amm || !amm.pairExplorerUrl) return;

    return amm.pairExplorerUrl.replace("{target_pair}", `${pair.address}`);
};
