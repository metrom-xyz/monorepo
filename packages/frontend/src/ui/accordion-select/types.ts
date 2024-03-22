import type { Component } from "vue";

export type ValueType = string | number;

export interface AccordionSelectOption<V extends ValueType> {
    label: string;
    value: V;
    icon?: Component;
    disabled?: boolean;
}

export interface AccordionSelectProps<
    T extends AccordionSelectOption<ValueType>,
> {
    label: string;
    icon: Component;
    selected: T | null;
    options: T[];
    disabled?: boolean;
}
