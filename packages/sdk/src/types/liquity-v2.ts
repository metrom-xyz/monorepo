import type { Erc20Token } from "./commons";

export interface LiquityV2Collateral {
    token: Erc20Token;
    debt: number;
    tvl: string;
    usdTvl: number;
}
