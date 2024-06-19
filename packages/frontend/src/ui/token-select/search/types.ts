import type { TokenInfo } from "@uniswap/token-lists";

export interface TokenSelectSearchProps {
    loadingTokens?: boolean;
    loadingBalances?: boolean;
    selected?: string | null;
    tokens?: TokenInfo[];
    optionDisabled?: (token: TokenInfo) => boolean;
    messages: {
        inputLabel: string;
        inputPlaceholder: string;
        noTokens: string;
    };
}
