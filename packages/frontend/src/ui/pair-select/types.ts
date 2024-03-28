import type { TokenInfo } from "@uniswap/token-lists";
import type { Address } from "viem";
import type { PairSelectSearchProps } from "./search/types";

export interface PairSelectProps {
    open?: boolean;
    pairs?: Pair[];
    messages: {
        inputPlaceholder: string;
        search: PairSelectSearchProps["messages"];
    };
}

export interface Pair {
    id: Address;
    token0: TokenInfo;
    token1: TokenInfo;
    tvl: number;
}
