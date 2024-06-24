import type { Component } from "vue";

export interface AccordionProps {
    onExpandToggle?: (event: MouseEvent, expanded: boolean) => void;
    expanded?: boolean;
    disabled?: boolean;
    expandIcon?: Component;
}
