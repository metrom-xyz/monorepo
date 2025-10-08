import type { Address } from "viem";
import type { ChainType, Erc20Token } from "./commons";

export interface AaveV3Collateral {
    chainId: number;
    chainType: ChainType;
    token: Erc20Token;
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
