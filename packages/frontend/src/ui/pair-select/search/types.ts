import type { Pair } from "../types";

export interface PairSelectSearchProps {
    label: string;
    loading?: boolean;
    selected?: Pair | null;
    pairs?: Pair[];
}
