import { CHAIN_DATA } from "../commons";
import type { DexInfo } from "../types";

export function useDexes(): DexInfo[] {
    return Object.values(CHAIN_DATA).flatMap((chainData) => {
        return chainData.dexes.map((dex) => ({ ...dex }));
    });
}
