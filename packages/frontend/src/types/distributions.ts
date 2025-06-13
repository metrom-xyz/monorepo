import type { OnChainAmount } from "@metrom-xyz/sdk";
import type { Address } from "viem";

export interface ProcessedDistribution {
    timestamp: number;
    tokens: Record<string, OnChainAmount>;
    weights: Record<string, Record<string, Weight>>;
}

export interface Weight {
    amount: OnChainAmount;
    amountChange: OnChainAmount;
    percentage: OnChainAmount;
}

export interface DataHash {
    hash: string;
    timestamp: number;
}

export interface Leaf {
    account: string;
    tokenAddress: Address;
    amount: string;
}

export interface DataHashesResponse {
    dataHashes: DataHash[];
}

export interface DistributionsResponse {
    timestamp: number;
    leaves: Leaf[];
}

export type Distribution = DistributionsResponse;

export type TokenMap = Record<string, Record<string, bigint>>;
