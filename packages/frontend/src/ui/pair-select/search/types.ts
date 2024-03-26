import type { Pair } from "../types";

export interface PairSelectSearchProps {
    label: string;
    loading?: boolean;
    selectedPair?: Pair | null;
    pairs?: Pair[];
}
