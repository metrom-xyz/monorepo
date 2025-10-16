import type { BackendErc20Token } from "./commons";

export interface BackendFungibleAsset extends BackendErc20Token {
    totalSupply: string;
    usdTotalSupply: number;
}

export type BackendFungibleAssetResponse = BackendFungibleAsset;
