import type { Token } from "@/sdk/entities/token";

export interface PairSelectSearchRowProps {
    selected?: boolean;
    loading?: boolean;
    token0: Token;
    token1: Token;
    tvl?: number;
}
