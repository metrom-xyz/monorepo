import { CHAIN_DATA } from "../commons";
import { type DexInfo, ProtocolType } from "../types";

export function useDexes(): DexInfo[] {
    return Object.values(CHAIN_DATA).flatMap((chainData) => {
        return chainData.protocols[ProtocolType.Dex].map((dex) => ({ ...dex }));
    });
}
