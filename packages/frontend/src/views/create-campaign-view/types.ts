import type { TokenInfo } from "@uniswap/token-lists";

export interface CampaignState {
    network?: number;
    amm?: string;
    pair?: string;
    rewards: Reward[];
}

export interface Reward {
    token?: TokenInfo;
    amount?: number;
}

export interface CampaignStepProps {
    state: CampaignState;
    completed?: boolean;
}
