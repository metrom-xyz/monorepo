import { type Component, type MaybeRef } from "vue";

export interface AccordionSummaryProps {
    expandIcon?: Component;
    expanded?: MaybeRef<boolean>;
}
