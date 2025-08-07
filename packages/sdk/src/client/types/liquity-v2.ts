import type { Address } from "viem";
import type { BackendUsdPricedErc20Token } from "./commons";

export interface BackendLiquityV2Collaterals {
    address: Address;
    mintedDebt: number;
    stabilityPoolDebt: number;
    tvl: string;
    usdTvl: number;
}

export interface BackendLiquityV2CollateralsResponse {
    resolvedPricedTokens: Record<Address, BackendUsdPricedErc20Token>;
    collaterals: BackendLiquityV2Collaterals[];
}
