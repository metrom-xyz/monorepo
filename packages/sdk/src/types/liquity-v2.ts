import type { ChainType, UsdPricedErc20Token } from "./commons";

export interface LiquityV2Collateral extends UsdPricedErc20Token {
    chainId: number;
    chainType: ChainType;
    liquidity: bigint;
    usdTvl: number;
    usdMintedDebt: number;
    usdStabilityPoolDebt: number;
}
