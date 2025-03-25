import type { SupportedAmm, SupportedDex } from "src/commons";
import type { Address, Hex } from "viem";

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

export interface AmmPool {
    chainId: number;
    id: Hex;
    dex: Brand<SupportedDex>;
    amm: SupportedAmm;
    tokens: Erc20Token[];
    usdTvl?: number;
    fee?: number;
}

export interface AmmPoolWithTvl extends AmmPool {
    usdTvl: number;
}
