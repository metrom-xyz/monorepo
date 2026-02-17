import type { ChainType, Erc20Token } from "./commons";

export interface OdysseyAsset extends Erc20Token {
    chainId: number;
    chainType: ChainType;
    totalAllocated: bigint;
    totalDeposited: bigint;
    usdTotalAllocated: number;
    usdTotalDeposited: number;
}
