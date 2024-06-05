import { type Address, type Hex } from "viem";
import type { SupportedAmm } from "./commons";

export interface Erc20Token {
    chainId: number;
    address: Address;
    decimals: number;
    symbol: string;
    name: string;
}

export interface Erc20TokenAmount {
    token: Erc20Token;
    amount: bigint;
}

export function erc20TokenEquals(a: Erc20Token, b: Erc20Token): boolean {
    return a === b || (a.chainId === b.chainId && a.address === b.address);
}

export interface Pool {
    address: Address;
    amm: SupportedAmm;
    token0: Erc20Token;
    token1: Erc20Token;
}

export interface Reward {
    token: Erc20Token;
    amount: bigint;
    claimed: bigint;
    recovered: bigint;
    remaining: bigint;
    usdValue: number | null;
}

export type Campaign = {
    id: Address;
    createdAt: number;
    owner: Address;
    pendingOwner: Address;
    from: number;
    to: number;
    pool: Pool;
    specification: Hex;
    root: Hex;
    data: Hex;
    rewardsUsdValue: number | null;
    apr: number | null;
    rewards: Reward[];
};

export interface Claim {
    campaignId: Address;
    token: Erc20Token;
    amount: bigint;
    remaining: bigint;
    proof: Address[];
}

export interface WhitelistedErc20Token extends Erc20Token {
    minimumRate: bigint;
}
