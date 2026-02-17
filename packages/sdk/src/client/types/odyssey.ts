import type { BackendErc20Token } from "./commons";

export interface BackendOdysseyAsset extends BackendErc20Token {
    totalAllocated: string;
    totalDeposited: string;
    usdTotalAllocated: number;
    usdTotalDeposited: number;
}

export interface BackendOdysseyAssetsResponse {
    assets: BackendOdysseyAsset[];
}
