import type { CampaignState } from "@/views/create-campaign-view/types";

export interface CampaignCreationFormProps {
    state: CampaignState;
    onPreviewClick: () => void;
}
