import type { Pool } from "sdk";

export interface PoolSelectSearchProps {
    loading?: boolean;
    selected?: Pool | null;
    pools?: Pool[];
    messages: {
        inputLabel: string;
        inputPlaceholder: string;
        noPools: string;
    };
}
