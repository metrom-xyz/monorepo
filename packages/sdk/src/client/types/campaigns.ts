import type { Address, Hex } from "viem";
import type {
    BackendAmmPool,
    BackendErc20Token,
    BackendUsdPricedErc20Token,
} from "./commons";
import type { Specification } from "src/types/campaigns";

export interface BackendAmmPoolLiquidityTarget {
    type: "amm-pool-liquidity";
    chainId: number;
    poolAddress: Address;
}

export interface BackendLiquityV2DebtTarget {
    type: "liquity-v2-debt";
    chainId: number;
    liquityV2Brand: string;
}

export interface BackendTokenDistributable {
    token: Address;
    amount: string;
    remaining: string;
}

export interface BackendTokenDistributables {
    type: "tokens";
    list: BackendTokenDistributable[];
}

export interface BackendPointDistributables {
    type: "points";
    amount: string;
}

export interface BackendCampaign {
    chainId: number;
    id: Hex;
    from: number;
    to: number;
    createdAt: number;
    snapshottedAt?: number;
    target: BackendAmmPoolLiquidityTarget | BackendLiquityV2DebtTarget;
    specification?: Specification;
    distributables: BackendTokenDistributables | BackendPointDistributables;
    apr?: number;
}

export interface BackendLiquityV2DebtBrand {
    brand: string;
    usdDebt: number;
}

export interface BackendCampaignsResponse {
    resolvedTokens: Record<number, Record<Address, BackendErc20Token>>;
    resolvedPricedTokens: Record<
        number,
        Record<Address, BackendUsdPricedErc20Token>
    >;
    resolvedAmmPools: Record<number, Record<Address, BackendAmmPool>>;
    resolvedLiquityV2Debts: Record<
        number,
        Record<string, BackendLiquityV2DebtBrand>
    >;
    campaigns: BackendCampaign[];
}

export interface BackendCampaignResponse {
    resolvedTokens: Record<number, Record<Address, BackendErc20Token>>;
    resolvedPricedTokens: Record<
        number,
        Record<Address, BackendUsdPricedErc20Token>
    >;
    resolvedAmmPools: Record<number, Record<Address, BackendAmmPool>>;
    resolvedLiquityV2Debts: Record<
        number,
        Record<string, BackendLiquityV2DebtBrand>
    >;
    campaign: BackendCampaign;
}
