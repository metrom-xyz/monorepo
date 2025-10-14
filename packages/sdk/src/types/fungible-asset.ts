import type { Address } from "viem";
import type { Erc20Token } from "./commons";

export interface FungibleAssetInfo extends Erc20Token {
    address: Address;
    totalSupply: bigint;
    usdTotalSupply: number;
}
