import type { CampaignStepProps } from "@/views/create-campaign-view/types";

export interface PreviewCampaignProps extends CampaignStepProps {
    disabled?: boolean;
    validated?: boolean;
}
