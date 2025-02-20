import type { Address } from "viem";
import type { BackendAmmPoolWithTvl, BackendErc20Token } from "./commons";

export interface BackendAmmPoolWithTvlAndAddress extends BackendAmmPoolWithTvl {
    address: Address;
}

export interface BackendPoolsResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    ammPools: BackendAmmPoolWithTvlAndAddress[];
}

export interface BackendPoolResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    ammPool: BackendAmmPoolWithTvlAndAddress;
}
