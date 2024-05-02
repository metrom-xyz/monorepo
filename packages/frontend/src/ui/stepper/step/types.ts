import type { Component } from "vue";

export interface StepItemProps {
    error?: boolean;
    active?: boolean;
    completed?: boolean;
    disabled?: boolean;
    title: string;
    step: number;
    icon: Component;
}
