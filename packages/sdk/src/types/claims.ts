import type { Hex } from "viem";
import type {
    ChainType,
    UsdPricedErc20Token,
    UsdPricedOnChainAmount,
} from "./commons";

export interface Claim {
    chainId: number;
    chainType: ChainType;
    campaignId: Hex;
    token: UsdPricedErc20Token;
    amount: UsdPricedOnChainAmount;
    proof: Hex[];
}

export type Reimbursement = Claim;
