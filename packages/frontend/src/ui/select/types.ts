import type { BaseInputWrapperProps } from "../commons/types";

export type ValueType = string | number;

export interface SelectOption<V extends ValueType> {
    label: string;
    value: V;
    disabled?: boolean;
}

export type SelectProps<T extends SelectOption<ValueType>> = {
    options: T[];
    optionHeight?: number;
    selected: T | null;
    search?: boolean;
    loading?: boolean;
    messages: {
        noResults: string;
    };
} & Omit<BaseInputWrapperProps, "onChange" | "value" | "id">;
