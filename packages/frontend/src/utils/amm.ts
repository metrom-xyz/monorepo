import { CHAIN_DATA } from "@/commons";
import type { Amm } from "@/types";
import type { SupportedChain } from "sdk";

export const getAmm = (
    chainId: SupportedChain,
    ammSlug: string,
): Amm | undefined => {
    return CHAIN_DATA[chainId].amms.find((amm) => amm.slug === ammSlug);
};
