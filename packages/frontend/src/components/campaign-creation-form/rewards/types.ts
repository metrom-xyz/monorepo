import type { CampaignStepProps } from "@/views/create-campaign-view/types";
import type { TokenInfo } from "@uniswap/token-lists";

export type TokenInfoWithBalance = TokenInfo & {
    balance?: bigint | null;
};

export interface RewardsPickerTypes extends CampaignStepProps {}
