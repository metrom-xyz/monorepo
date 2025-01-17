import type { Hex } from "viem";
import type { UsdPricedErc20Token, UsdPricedOnChainAmount } from "./commons";

export interface Claim {
    chainId: number;
    campaignId: Hex;
    token: UsdPricedErc20Token;
    amount: UsdPricedOnChainAmount;
    proof: Hex[];
}

export type Reimbursement = Claim;
