import type { Address } from "viem";

export enum ChainType {
    Evm = "evm",
    Svm = "svm",
    Aptos = "aptos",
    Sui = "sui",
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

export interface Erc20LpDetails {
    type: "lp";
    dex: string;
    baseTokenSymbol: string;
    quoteTokenSymbol: string;
}

export interface Erc20ProtocolDetails {
    type: "protocol";
    slug: string;
}

export type Erc20TokenDetails = Erc20LpDetails | Erc20ProtocolDetails | null;

export interface Erc20Token {
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
    details: Erc20TokenDetails;
}

export type BaseErc20Token = Omit<Erc20Token, "details">;

export interface UsdPricedErc20Token extends Erc20Token {
    usdPrice: number;
}

export interface UsdPricedErc20TokenWithTotalSupply extends UsdPricedErc20Token {
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
