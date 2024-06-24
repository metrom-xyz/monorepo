import type { Component } from "vue";

export interface OptionProps {
    label: string;
    selected?: boolean;
    icon?: Component;
}
