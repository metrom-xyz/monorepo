import type { Erc20Token } from "@metrom-xyz/sdk";

export interface PoolSelectSearchRowProps {
    selected?: boolean;
    loading?: boolean;
    token0: Erc20Token;
    token1: Erc20Token;
    tvl?: number;
    fee?: number;
}
