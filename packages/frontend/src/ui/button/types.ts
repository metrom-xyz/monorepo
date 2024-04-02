import type { Component } from "vue";

export interface ButtonProps {
    loading?: boolean;
    icon?: Component;
    iconRight?: boolean;
    xs?: boolean;
    sm?: boolean;
    lg?: boolean;
    secondary?: boolean;
    active?: boolean;
}
