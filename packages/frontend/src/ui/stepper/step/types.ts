import type { Component } from "vue";

export interface StepItemProps {
    active?: boolean;
    completed?: boolean;
    title: string;
    step: number;
    icon: Component;
}
