import type { ChainType } from "src/types/commons";
import type { Address, Hex } from "viem";
import type {
    BackendAaveV3Collateral,
    BackendLiquityV2Collateral,
} from "./campaigns";

export type BackendResolvedTokensRegistry = Record<
    ChainType,
    Record<number, Record<Address, BackendErc20Token>>
>;

export type BackendResolvedPricedTokensRegistry = Record<
    ChainType,
    Record<number, Record<Address, BackendUsdPricedErc20Token>>
>;

export type BackendResolvedAmmPoolsRegistry = Record<
    ChainType,
    Record<number, Record<Hex, BackendAmmPool>>
>;

export type BackendResolvedLiquityV2CollateralsRegistry = Record<
    ChainType,
    Record<number, Record<string, Record<Hex, BackendLiquityV2Collateral>>>
>;

export type BackendResolvedAaveV3CollateralsRegistry = Record<
    ChainType,
    Record<
        number,
        Record<string, Record<string, Record<Hex, BackendAaveV3Collateral>>>
    >
>;

export interface BackendErc20Token {
    decimals: number;
    symbol: string;
    name: string;
}

export interface BackendUsdPricedErc20Token extends BackendErc20Token {
    usdPrice: number;
}

export interface BackendWhitelistedErc20Token
    extends BackendUsdPricedErc20Token {
    address: Address;
    minimumRate: string;
}

export interface BackendAmmPool {
    dex: string;
    amm: string;
    tokens: Address[];
    liquidityType: string;
    liquidity?: string;
    usdTvl?: number;
    fee?: number;
}

export interface BackendAmmPoolWithTvl extends BackendAmmPool {
    usdTvl: number;
}
