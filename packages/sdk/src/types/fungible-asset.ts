import type { Erc20Token } from "./commons";

export interface FungibleAssetInfo extends Erc20Token {
    totalSupply: bigint;
    usdTotalSupply: number;
}
