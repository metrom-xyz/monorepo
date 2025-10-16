import type { Address, Hex } from "viem";
import type { BackendAmmPoolWithTvl, BackendErc20Token } from "./commons";
import type { SupportedAmm, SupportedDex } from "src/commons";
import type { AmmPoolLiquidityType } from "src/types/commons";

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

export interface BackendCampaignAmmPool {
    id: Hex;
    dex: SupportedDex;
    amm: SupportedAmm;
    tokens: BackendErc20Token[];
    liquidityType: AmmPoolLiquidityType;
    liquidity?: string;
    usdTvl?: number;
    fee?: number;
}
