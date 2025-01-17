import type { Address } from "viem";
import type { AmmPool } from "./commons";

export interface AmmPoolWithAddress extends AmmPool {
    address: Address;
}
