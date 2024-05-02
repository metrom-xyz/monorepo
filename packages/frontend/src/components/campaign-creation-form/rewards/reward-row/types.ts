import type { Reward } from "@/types";
import type { TokenInfo } from "@uniswap/token-lists";

export interface RewardRowProps {
    rewards: Reward[];
    token?: TokenInfo;
    amount?: number;
    onRemove?: (index: number) => void;
}
