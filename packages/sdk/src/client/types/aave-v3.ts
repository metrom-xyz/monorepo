import type { Address } from "viem";
import type { BackendErc20Token } from "./commons";

export interface BackendAaveV3Collateral {
    address: Address;
    debt: string;
    supply: string;
    netSupply: string;
    usdDebt: number;
    usdSupply: number;
    usdNetSupply: number;
}

export interface BackendAaveV3CollateralsResponse {
    resolvedTokens: Record<Address, BackendErc20Token>;
    collaterals: BackendAaveV3Collateral[];
}
