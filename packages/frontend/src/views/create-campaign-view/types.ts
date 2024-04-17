import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import type { TokenInfo } from "@uniswap/token-lists";
import type { Dayjs } from "dayjs";
import type { Pair } from "sdk";

export interface CampaignState {
    network?: AccordionSelectOption<number>;
    amm?: AccordionSelectOption<string>;
    pair?: Pair;
    rewards: Reward[];
    range?: Range;
}

export interface Reward {
    token?: TokenInfo;
    amount?: number;
}

export interface Range {
    from?: Dayjs;
    to?: Dayjs;
}

export interface CampaignStepProps {
    state: CampaignState;
    completed?: boolean;
}
