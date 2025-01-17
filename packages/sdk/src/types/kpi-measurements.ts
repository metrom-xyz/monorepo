import type { Erc20Token, UsdPricedOnChainAmount } from "./commons";

export interface KpiRewardDistribution {
    token: Erc20Token;
    distributed: UsdPricedOnChainAmount;
    reimbursed: UsdPricedOnChainAmount;
}

export interface KpiMeasurement {
    from: number;
    to: number;
    percentage: number;
    value: number;
    distributions: KpiRewardDistribution[];
}
