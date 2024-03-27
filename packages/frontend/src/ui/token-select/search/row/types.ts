import type { TokenInfo } from "@uniswap/token-lists";

export interface TokenSelectSearchRowProps extends TokenInfo {
    selected?: boolean;
    loading?: boolean;
}
