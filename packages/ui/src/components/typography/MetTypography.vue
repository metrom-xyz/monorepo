<script setup lang="ts">
import { ref } from "vue";
import { type TypographyProps } from "./types";

const props = defineProps<TypographyProps>();

const element = ref(null);

const baseComponent = props.h1
    ? "h1"
    : props.h2
      ? "h2"
      : props.h3
        ? "h3"
        : props.h4
          ? "h4"
          : "p";

defineExpose({ element });
</script>
<template>
    <component
        ref="element"
        :is="baseComponent"
        class="met_typography__root"
        :class="{
            met_typography__root__upper: $props.uppercase,
            met_typography__root__normal: $props.normal,
            met_typography__root__medium: $props.medium,
            met_typography__root__bold: $props.bold,
            met_typography__root__xs: $props.xs,
            met_typography__root__sm: $props.sm,
            met_typography__root__lg: $props.lg,
            met_typography__root__xl: $props.xl,
            met_typography__root__h1: $props.h1,
            met_typography__root__h2: $props.h2,
            met_typography__root__h3: $props.h3,
            met_typography__root__h4: $props.h4,
        }"
    >
        <slot></slot>
    </component>
</template>
<style>
.met_typography__root {
    @apply leading-normal text-black font-inter text-base;
}

.met_typography__root__upper {
    @apply uppercase;
}

.met_typography__root__xs {
    @apply font-normal text-xs;
}

.met_typography__root__sm {
    @apply font-normal text-sm;
}

.met_typography__root__lg {
    @apply font-normal text-lg;
}

.met_typography__root__xl {
    @apply font-normal text-xl;
}

.met_typography__root__h1 {
    @apply text-h1;
}

.met_typography__root__h2 {
    @apply text-h2;
}

.met_typography__root__h3 {
    @apply text-h3;
}

.met_typography__root__h4 {
    @apply text-h4;
}

.met_typography__root__normal {
    @apply font-normal;
}

.met_typography__root__medium {
    @apply font-medium;
}

.met_typography__root__bold {
    @apply font-extrabold;
}
</style>
