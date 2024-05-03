import { CHAIN_DATA } from "@/commons";
import { SupportedAmm, type Amm } from "@/types";
import { SupportedChain, type Pair } from "sdk";

export const getAmm = (
    chainId: SupportedChain,
    ammSlug: string,
): Amm | undefined => {
    return CHAIN_DATA[chainId].amms.find((amm) => amm.slug === ammSlug);
};

export const getPoolLink = (amm: Amm, pair: Pair): string => {
    if (amm.slug === SupportedAmm.AlgebraIntegral)
        return amm.addLiquidityUrl.replace("{target_pair}", `${pair.address}`);

    return amm.addLiquidityUrl.replace(
        "{target_pair}",
        `${pair.token0.address}/${pair.token1.address}`,
    );
};
