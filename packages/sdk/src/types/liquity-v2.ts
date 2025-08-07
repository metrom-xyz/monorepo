import type { UsdPricedErc20Token } from "./commons";

export interface LiquityV2Collateral {
    chainId: number;
    token: UsdPricedErc20Token;
    usdTvl: number;
    usdMintedDebt: number;
    usdStabilityPoolDebt: number;
}
