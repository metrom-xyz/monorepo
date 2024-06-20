import type { Pool } from "sdk";

export interface PoolSelectSearchProps {
    loading?: boolean;
    selected?: Pool | null;
    pools?: Pool[];
    messages: {
        label: string;
        placeholder: string;
        noPools: string;
    };
}
