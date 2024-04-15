import type { Pair } from "@/sdk/entities/pair";

export interface PairSelectSearchProps {
    loading?: boolean;
    selected?: Pair | null;
    pairs?: Pair[];
    messages: {
        inputLabel: string;
        inputPlaceholder: string;
        noPairs: string;
    };
}
