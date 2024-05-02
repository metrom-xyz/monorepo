import type { Reward } from "@/types";
import type { ChainContract } from "viem";

export interface ApproveRewardsProps {
    rewards: Required<Reward[]>;
    metrom: ChainContract;
}
