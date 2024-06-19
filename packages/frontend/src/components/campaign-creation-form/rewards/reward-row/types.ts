import type { CampaignState, Reward } from "@/types";
import type { TokenInfoWithBalance } from "../types";

export interface RewardRowProps {
    state: CampaignState;
    tokens: TokenInfoWithBalance[];
    rewards: Reward[];
    loadingBalances?: boolean;
    loadingTokens?: boolean;
    onRemove?: (index: number) => void;
}
