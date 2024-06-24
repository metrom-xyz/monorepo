import type { TokenInfo } from "../../../types";

export interface TokenSelectSearchProps {
    loadingTokens?: boolean;
    loadingBalances?: boolean;
    selected?: string | null;
    tokens?: TokenInfo[];
    optionDisabled?: (token: TokenInfo) => boolean;
    messages: {
        label: string;
        placeholder: string;
        noTokens: string;
    };
}
