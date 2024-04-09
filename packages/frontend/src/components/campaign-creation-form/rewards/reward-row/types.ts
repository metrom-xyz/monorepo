import type { Reward } from "@/views/create-campaign-view/types";
import type { TokenInfo } from "@uniswap/token-lists";

export interface RewardRowProps {
    rewards: Reward[];
    tokens?: TokenInfo[];
    token?: TokenInfo;
    amount?: number;
    onRemove?: (index: number) => void;
}
