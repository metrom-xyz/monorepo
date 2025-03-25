import type { Hex } from "viem";
import type { AmmPool } from "./commons";

export interface AmmPoolWithId extends AmmPool {
    id: Hex;
}
