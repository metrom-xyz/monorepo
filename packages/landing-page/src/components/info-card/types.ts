import type { Component } from "vue";

export interface InfoCardProps {
    icon: Component;
    title: string;
    description?: string;
    href?: string;
}
