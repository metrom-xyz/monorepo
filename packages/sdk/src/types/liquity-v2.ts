import type { ChainType, UsdPricedErc20Token } from "./commons";

export interface LiquityV2Collateral {
    chainId: number;
    chainType: ChainType;
    token: UsdPricedErc20Token;
    liquidity: bigint;
    usdTvl: number;
    usdMintedDebt: number;
    usdStabilityPoolDebt: number;
}
