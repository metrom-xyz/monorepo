import type { BackendUsdPricedErc20Token } from "./commons";

export interface BackendLiquityV2Collaterals
    extends BackendUsdPricedErc20Token {
    mintedDebt: number;
    stabilityPoolDebt: number;
    tvl: string;
    usdTvl: number;
}

export interface BackendLiquityV2CollateralsResponse {
    collaterals: BackendLiquityV2Collaterals[];
}
