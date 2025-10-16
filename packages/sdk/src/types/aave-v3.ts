import type { Address } from "viem";
import type { ChainType, UsdPricedErc20Token } from "./commons";

export interface AaveV3Collateral extends UsdPricedErc20Token {
    chainId: number;
    chainType: ChainType;
    debt: bigint;
    supply: bigint;
    netSupply: bigint;
    usdDebt: number;
    usdSupply: number;
    usdNetSupply: number;
}

export interface AaveV3Market {
    address: Address;
    slug: string;
    name: string;
}
