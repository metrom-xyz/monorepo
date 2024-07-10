import type { TokenInfo } from "../../types";
import type { TokenSelectSearchProps } from "./search/types";

export interface TokenSelectProps {
    tokens?: TokenInfo[];
    loadingTokens?: boolean;
    loadingBalances?: boolean;
    open?: boolean;
    error?: boolean;
    optionDisabled?: (token: TokenInfo) => boolean;
    messages: {
        placeholder: string;
        search: TokenSelectSearchProps["messages"];
    };
}
