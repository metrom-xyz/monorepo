import type { CampaignStepProps } from "@/views/create-campaign-view/types";

export interface DeployCampaignProps extends CampaignStepProps {
    disabled?: boolean;
    validated?: boolean;
}
