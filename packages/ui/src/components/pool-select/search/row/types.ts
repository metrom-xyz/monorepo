import type { Token } from "@metrom-xyz/sdk";

export interface PoolSelectSearchRowProps {
    selected?: boolean;
    loading?: boolean;
    token0: Token;
    token1: Token;
    tvl?: number;
    fee?: number;
}
