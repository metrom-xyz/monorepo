import type { Erc20Token } from "sdk";

export interface PairSelectSearchRowProps {
    selected?: boolean;
    loading?: boolean;
    token0: Erc20Token;
    token1: Erc20Token;
    tvl?: number;
}
