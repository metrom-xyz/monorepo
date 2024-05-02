import type { CampaignState } from "@/types";

export interface CampaignCreationFormProps {
    state: CampaignState;
    onPreviewClick: () => void;
}
