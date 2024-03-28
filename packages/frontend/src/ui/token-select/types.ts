import type { TokenInfo } from "@uniswap/token-lists";
import type { TokenSelectSearchProps } from "./search/types";

export interface TokenSelectProps {
    open?: boolean;
    tokens?: TokenInfo[];
    optionDisabled?: (token: TokenInfo) => boolean;
    messages: {
        inputPlaceholder: string;
        search: TokenSelectSearchProps["messages"];
    };
}
