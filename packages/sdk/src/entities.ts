import { type Address, type Hash } from "viem";
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

export interface RewardBalance {
    amount: number;
    remaining: number;
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

export interface Rewards extends Array<UsdPricedTokenAmount & RewardBalance> {
    usdValue: number | null;
}

export enum Status {
    Live = "live",
    Upcoming = "upcoming",
    Ended = "ended",
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
    chainId: number;
    campaignId: Address;
    token: Token;
    amount: number;
    proof: Address[];
}

export interface WhitelistedErc20Token extends UsdPricedToken {
    minimumRate: number;
}

export interface Activity {
    transaction: {
        hash: Hash;
        timestamp: number;
    };
    payload:
        | {
              type: "claimReward";
              token: Token;
              amount: number;
              receiver: Address;
          }
        | {
              type: "createCampaign";
              id: Hash;
          };
}

export interface WhitelistedErc20TokenAmount extends TokenAmount {
    minimumRate: number;
    usdPrice: number | null;
}

export interface TokenWithBalance extends Token {
    balance?: bigint;
}

export interface WhitelistedErc20TokenWithBalance
    extends WhitelistedErc20Token {
    balance?: bigint;
}
