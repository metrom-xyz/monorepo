import type { BackendUsdPricedErc20Token } from "./commons";

export interface BackendAaveV3Collateral extends BackendUsdPricedErc20Token {
    debt: string;
    supply: string;
    netSupply: string;
    usdDebt: number;
    usdSupply: number;
    usdNetSupply: number;
}

export interface BackendAaveV3CollateralsResponse {
    collaterals: BackendAaveV3Collateral[];
}
