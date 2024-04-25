import { CACHER } from "../commons";
import type { Address } from "viem";

export const cacheAmmSlug = (
    pairAddress: Address,
    amm: string,
    validUntil?: number,
) => {
    if (!validUntil || validUntil < Date.now())
        validUntil = Date.now() + 172_800_000; // 2 days by default
    CACHER.set<string>(pairAddress, amm, validUntil);
};

export const getCachedAmmSlug = (pairAddress: Address): string | null => {
    return CACHER.get<string>(pairAddress);
};

export const removeCachedAmmSlug = (pairAddress: Address) => {
    CACHER.clear(pairAddress);
};
