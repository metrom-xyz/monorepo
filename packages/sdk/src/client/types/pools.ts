import type { Address } from "viem";
import type { BackendAmmPool, BackendErc20Token } from "./commons";

export interface BackendAmmPoolWithAddress extends BackendAmmPool {
    address: Address;
}

export interface BackendPoolsResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    ammPools: BackendAmmPoolWithAddress[];
}
