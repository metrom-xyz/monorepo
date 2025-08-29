import type { Address } from "viem";
import type { BackendErc20Token } from "./commons";

export interface BackendAaveV3Collaterals {
    address: Address;
    debt: string;
    supply: string;
    usdDebt: number;
    usdSupply: number;
}

export interface BackendAaveV3CollateralsResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    collaterals: BackendAaveV3Collaterals[];
}
