import type { Component } from "vue";

export interface SubmitButtonProps {
    variant?: "base" | "success";
    disabled?: boolean;
    loading?: boolean;
    icon?: Component;
    onClick: () => void;
}
