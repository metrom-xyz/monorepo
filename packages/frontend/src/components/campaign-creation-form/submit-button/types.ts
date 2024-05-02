import type { Component } from "vue";

export interface SubmitButtonProps {
    disabled?: boolean;
    loading?: boolean;
    icon?: Component;
    onClick: () => void;
}
