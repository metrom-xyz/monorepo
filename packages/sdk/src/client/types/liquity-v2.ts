import type { Address } from "viem";
import type { BackendErc20Token } from "./commons";

export interface BackendLiquityV2Collaterals {
    address: Address;
    mintedDebt: number;
    stabilityPoolDebt: number;
    tvl: string;
    usdTvl: number;
}

export interface BackendLiquityV2CollateralsResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    collaterals: BackendLiquityV2Collaterals[];
}
