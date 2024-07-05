import type { Pool } from "@metrom-xyz/sdk";
import type { TokenInfo } from "../../../types";

export interface PoolSelectSearchProps {
    loading?: boolean;
    selected?: Pool | null;
    pools?: Pool[];
    baseTokens?: TokenInfo[];
    messages: {
        label: string;
        pool: string;
        tvl: string;
        placeholder: string;
        noPools: string;
    };
}
