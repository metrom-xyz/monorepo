import type { Address } from "viem";
import type { BackendErc20Token } from "./commons";

export interface BackendFungibleAsset extends BackendErc20Token {
    address: Address;
    totalSupply: string;
    usdTotalSupply: number;
}

export type BackendFungibleAssetResponse = BackendFungibleAsset;
