import type { Address, Hex } from "viem";
import type { BackendErc20Token } from "./commons";
import type { SupportedAmm, SupportedDex } from "src/commons";
import type { AmmPoolLiquidityType } from "src/types/commons";

export interface BackendPoolsResponse {
    tokens: Record<Address, BackendErc20Token>;
    ammPools: BackendAmmPool[];
}

export interface BackendPoolResponse {
    tokens: Record<Address, BackendErc20Token>;
    ammPool: BackendAmmPool;
}

export interface BackendLiquidityByAddressResponse {
    liquidities: Record<Address, string>;
}

export interface BackendAmmPool {
    id: Hex;
    dex: SupportedDex;
    amm: SupportedAmm;
    tokens: Address[];
    liquidityType: string;
    liquidity: string;
    usdTvl: number;
    fee?: number;
}

export interface BackendCampaignAmmPool {
    id: Hex;
    dex: SupportedDex;
    amm: SupportedAmm;
    tokens: BackendErc20Token[];
    liquidityType: AmmPoolLiquidityType;
    fee?: number;
}
