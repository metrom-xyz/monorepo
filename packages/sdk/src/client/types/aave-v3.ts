import type { BackendUsdPricedErc20Token } from "./commons";

export interface BackendAaveV3Collateral extends BackendUsdPricedErc20Token {
    debt: string;
    supply: string;
    usdDebt: number;
    usdSupply: number;
}

export interface BackendAaveV3CollateralsResponse {
    collaterals: BackendAaveV3Collateral[];
}

export interface BackendAaveV3CollateralUsdNetSupplyResponse {
    usdNetSupply: number;
}
