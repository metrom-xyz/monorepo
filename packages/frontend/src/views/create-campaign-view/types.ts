import type { CampaignState } from "@/types";

export interface CampaignStepProps {
    state: CampaignState;
    completed?: boolean;
}

export interface CreateCampaignViewProps {
    selectedChain: number;
}
