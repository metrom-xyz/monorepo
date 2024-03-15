import type { Component } from "vue";

export interface BaseInputWrapperProps {
    xs?: boolean;
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    loading?: boolean;
    label?: string;
    error?: boolean | string;
    borderless?: boolean;
    info?: string;
    icon?: Component;
    iconLeft?: boolean;
    action?: Component;
    actionRight?: boolean;
    noModel?: boolean;
}
