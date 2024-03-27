import type { TokenInfo } from "@uniswap/token-lists";

export interface TokenSelectSearchProps {
    loading?: boolean;
    selected?: string | null;
    tokens?: TokenInfo[];
    messages: {
        inputLabel: string;
        inputPlaceholder: string;
        noTokens: string;
    };
}
