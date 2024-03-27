import type { TokenInfo } from "@uniswap/token-lists";
import type { TokenSelectSearchProps } from "./search/types";

export interface TokenSelectProps {
    open?: boolean;
    // modelValue?: string;
    tokens?: TokenInfo[];
    messages: {
        inputPlaceholder: string;
        search: TokenSelectSearchProps["messages"];
    };
}
