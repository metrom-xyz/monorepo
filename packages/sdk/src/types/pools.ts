import type { Hex } from "viem";
import type { AmmPool } from "./commons";
import type { RestrictionType } from "./campaigns";

export interface AmmPoolWithId extends AmmPool {
    id: Hex;
}

export interface LiquidityByAddresses {
    type: RestrictionType;
    liquidity: bigint;
}
