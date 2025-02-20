import type { Address } from "viem";

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
    usdTvl?: number;
    fee?: number;
}

export interface BackendAmmPoolWithTvl extends BackendAmmPool {
    usdTvl: number;
}
