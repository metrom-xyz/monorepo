import type { TokenInfo } from "@uniswap/token-lists";
import type { Address } from "viem";

export interface PairSelectProps {
    open?: boolean;
    pairs?: Pair[];
    selected?: Pair | null;
}

export interface Pair {
    id: Address;
    token0: TokenInfo;
    token1: TokenInfo;
    tvl: bigint;
}
