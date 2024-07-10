import type { CampaignState, Reward } from "@/types";
import type { TokenInfo } from "@metrom-xyz/ui";

export interface RewardRowProps {
    state: CampaignState;
    tokens?: TokenInfo[];
    rewards: Reward[];
    loadingBalances?: boolean;
    loadingTokens?: boolean;
    onRemove?: (index: number) => void;
}
