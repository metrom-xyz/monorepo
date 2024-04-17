import type { PairSelectSearchProps } from "./search/types";
import type { Pair } from "sdk";

export interface PairSelectProps {
    loading?: boolean;
    open?: boolean;
    pairs?: Pair[];
    messages: {
        inputPlaceholder: string;
        search: PairSelectSearchProps["messages"];
    };
}
