import type { Erc20Token } from "./commons";

export interface LiquityV2Collateral {
    token: Erc20Token;
    usdMintedDebt: number;
    usdStabilityPoolDebt: number;
    usdTvlUsd: number;
}
