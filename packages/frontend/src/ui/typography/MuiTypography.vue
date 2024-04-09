<script setup lang="ts">
import { type TypographyProps } from "./types";

const props = defineProps<TypographyProps>();

const baseComponent = props.h1
    ? "h1"
    : props.h2
      ? "h2"
      : props.h3
        ? "h3"
        : props.h4
          ? "h4"
          : "p";
</script>
<template>
    <component
        :is="baseComponent"
        class="mui_typography__root"
        :class="{
            mui_typography__root__upper: $props.uppercase,
            mui_typography__root__medium: $props.medium,
            mui_typography__root__bold: $props.bold,
            mui_typography__root__xs: $props.xs,
            mui_typography__root__sm: $props.sm,
            mui_typography__root__lg: $props.lg,
            mui_typography__root__xl: $props.xl,
            mui_typography__root__h1: $props.h1,
            mui_typography__root__h2: $props.h2,
            mui_typography__root__h3: $props.h3,
            mui_typography__root__h4: $props.h4,
        }"
    >
        <slot></slot>
    </component>
</template>
<style>
.mui_typography__root {
    @apply leading-normal text-black font-inter text-base;
}

.mui_typography__root__upper {
    @apply uppercase;
}

.mui_typography__root__xs {
    @apply font-normal font-inter text-xs;
}

.mui_typography__root__sm {
    @apply font-normal font-inter text-sm;
}

.mui_typography__root__lg {
    @apply font-normal font-inter text-lg;
}

.mui_typography__root__xl {
    @apply font-normal font-inter text-xl;
}

.mui_typography__root__h1 {
    @apply font-normal font-inter text-h1;
}

.mui_typography__root__h2 {
    @apply font-normal font-inter text-h2;
}

.mui_typography__root__h3 {
    @apply font-normal font-inter text-h3;
}

.mui_typography__root__h4 {
    @apply font-normal font-inter text-h4;
}

.mui_typography__root__medium {
    @apply font-medium;
}

.mui_typography__root__bold {
    @apply font-bold;
}
</style>
