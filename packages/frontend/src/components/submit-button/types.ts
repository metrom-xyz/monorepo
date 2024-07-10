import type { Component } from "vue";

export interface SubmitButtonProps {
    variant?: "base" | "submit" | "success";
    disabled?: boolean;
    loading?: boolean;
    icon?: Component;
    iconLeft?: boolean;
    onClick: () => void;
}
