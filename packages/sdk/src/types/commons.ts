import type { Address } from "viem";

export enum ChainType {
    Evm = "evm",
    Aptos = "aptos",
}

export interface Brand<S> {
    slug: S;
    name: string;
}

export interface OnChainAmount {
    raw: bigint;
    formatted: number;
}

export interface UsdPricedOnChainAmount extends OnChainAmount {
    usdValue: number;
}

export interface Erc20Token {
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
}

export interface UsdPricedErc20Token extends Erc20Token {
    usdPrice: number;
}

export interface UsdPricedErc20TokenWithTotalSupply
    extends UsdPricedErc20Token {
    totalSupply: bigint;
    usdTotalSupply: number;
}

export interface Erc20TokenAmount {
    token: Erc20Token;
    amount: OnChainAmount;
}

export interface UsdPricedErc20TokenAmount {
    token: UsdPricedErc20Token;
    amount: UsdPricedOnChainAmount;
}

export interface WhitelistedErc20Token extends UsdPricedErc20Token {
    minimumRate: OnChainAmount;
}

export enum AmmPoolLiquidityType {
    Concentrated = "concentrated",
    FullRange = "full-range",
}
