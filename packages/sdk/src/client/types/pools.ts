import type { Address, Hex } from "viem";
import type { BackendAmmPoolWithTvl, BackendErc20Token } from "./commons";

export interface BackendAmmPoolWithTvlAndId extends BackendAmmPoolWithTvl {
    id: Hex;
}

export interface BackendPoolsResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    ammPools: BackendAmmPoolWithTvlAndId[];
}

export interface BackendPoolResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    ammPool: BackendAmmPoolWithTvlAndId;
}

export interface BackendLiquidityByAddressResponse {
    liquidities: Record<Address, string>;
}
