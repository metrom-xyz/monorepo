import type { Reward } from "@/types";
import type { TokenInfoWithBalance } from "../types";

export interface RewardRowProps {
    tokens: TokenInfoWithBalance[];
    rewards: Reward[];
    loading?: boolean;
    globalFee?: number;
    onRemove?: (index: number) => void;
}
