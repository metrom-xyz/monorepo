import type { Component } from "vue";
import type { SelectOption, ValueType } from "../types";

export interface SelectRowProps<T extends SelectOption<ValueType>> {
    selected?: boolean;
    label?: string;
    optionComponent?: Component<{ option: T }>;
}
