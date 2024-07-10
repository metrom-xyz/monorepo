import type { Reward } from "@/types";
import type { ChainContract } from "viem";

export interface ApproveRewardProps {
    reward: Required<Reward>;
    fee?: number;
    total: number;
    index: number;
    loading: boolean;
    metrom: ChainContract;
    onApprove: () => void;
}
