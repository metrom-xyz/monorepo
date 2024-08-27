import { type Address } from "viem";
import type { SupportedAmm } from "./commons";

export interface Token {
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
}

export interface TokenAmount {
    token: Token;
    amount: number;
}

export interface UsdPricedToken extends Token {
    usdPrice: number | null;
}

export interface UsdPricedTokenAmount extends UsdPricedToken {
    usdValue: number | null;
}

export interface Pool {
    chainId: number;
    address: Address;
    amm: SupportedAmm;
    fee: number;
    token0: Token;
    token1: Token;
    tvl: number;
}

export interface Rewards extends Array<UsdPricedTokenAmount> {
    usdValue: number | null;
}

export enum Status {
    Live,
    Upcoming,
    Ended,
}

export interface Campaign {
    chainId: number;
    id: Address;
    from: number;
    to: number;
    status: Status;
    createdAt: number;
    snapshottedAt: number | null;
    pool: Pool;
    whitelist: Address[] | null;
    blacklist: Address[] | null;
    rewards: Rewards;
    apr: number | null;
}

export interface Claim extends TokenAmount {
    campaignId: Address;
    token: Token;
    amount: number;
    proof: Address[];
}

export interface WhitelistedErc20Token extends Token {
    minimumRate: bigint;
}

export interface WhitelistedErc20TokenAmount extends TokenAmount {
    minimumRate: bigint;
}

export interface TokenWithBalance extends Token {
    balance?: bigint;
}

export interface WhitelistedErc20TokenWithBalance
    extends WhitelistedErc20Token {
    balance?: bigint;
}
