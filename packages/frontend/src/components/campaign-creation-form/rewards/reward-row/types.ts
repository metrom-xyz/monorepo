import type { CampaignState, Reward } from "@/types";
import type { TokenInfoWithBalance } from "../types";

export interface RewardRowProps {
    state: CampaignState;
    tokens: TokenInfoWithBalance[];
    rewards: Reward[];
    loading?: boolean;
    onRemove?: (index: number) => void;
}
