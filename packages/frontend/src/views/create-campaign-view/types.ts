import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import type { Pair } from "@/ui/pair-select/types";
import type { TokenInfo } from "@uniswap/token-lists";

export interface CampaignState {
    network?: AccordionSelectOption<number>;
    amm?: AccordionSelectOption<string>;
    pair?: Pair;
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
