import { type Address } from "viem";

export enum Environment {
    Local = "local",
    Development = "development",
    Staging = "staging",
    Production = "production",
}

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

export interface Pair {
    address: Address;
    token0: Erc20Token;
    token1: Erc20Token;
}
