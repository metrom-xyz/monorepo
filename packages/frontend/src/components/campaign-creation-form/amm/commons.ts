import { CHAIN_DATA, SUPPORTED_CHAINS } from "@/commons";
import type { AccordionSelectOption } from "@/ui/accordion-select/types";

export const SUPPORTED_CHAIN_OPTIONS: AccordionSelectOption<number>[] =
    SUPPORTED_CHAINS.map((chain) => ({
        label: chain.name,
        value: chain.id,
        icon: CHAIN_DATA[chain.id].icon.logo,
    }));
