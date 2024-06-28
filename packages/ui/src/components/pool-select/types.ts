import type { PoolSelectSearchProps } from "./search/types";
import type { Pool } from "sdk";

export interface PoolSelectProps {
    loading?: boolean;
    open?: boolean;
    pools?: Pool[];
    baseTokens?: PoolSelectSearchProps["baseTokens"];
    messages: {
        inputPlaceholder: string;
        search: PoolSelectSearchProps["messages"];
    };
}
