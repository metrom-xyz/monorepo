import type { Address } from "viem";

export interface TokenInfo {
    readonly address: Address;
    readonly symbol: string;
    readonly name: string;
    readonly decimals: number;
    readonly logoURI?: string;
    readonly balance?: bigint;
}
