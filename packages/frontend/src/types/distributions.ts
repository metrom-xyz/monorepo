import type {
    OnChainAmount,
    UsdPricedErc20Token,
    UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import type { Address } from "viem";

export interface DistributedErc20Token {
    token: UsdPricedErc20Token;
    amount: OnChainAmount;
}

export interface UsdAccountWeights {
    totalAmount: number;
    amount: number;
    amountChange: number;
    percentage: number;
}

export interface Weights {
    usdWeights: UsdAccountWeights;
    accounts: Record<string, Weight>;
}

export interface ProcessedDistribution {
    timestamp: number;
    tokens: Record<string, DistributedErc20Token>;
    usdSummary: Record<string, UsdAccountWeights>;
    tokensSummary: Record<string, Record<string, UsdPricedErc20TokenAmount>>;
    weights: Record<string, Record<string, Weight>>;
}

export interface Weight {
    percentage: OnChainAmount;
    amount: OnChainAmount;
    amountChange: OnChainAmount;
    usdAmount: number;
    usdAmountChange: number;
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
    totalUsdAmountByAccount: Record<string, number>;
    totalTokensAmountByAccount: Record<
        string,
        Record<string, UsdPricedErc20TokenAmount>
    >;
    leaves: Leaf[];
}

export type Distribution = DistributionsResponse;

export type TokenMap = Record<string, Record<string, bigint>>;
