<script setup lang="ts">
import { type SkeletonProps } from "./types";

const props = defineProps<SkeletonProps>();

const sanitizedWidth =
    typeof props.width === "number" ? `${props.width}px` : props.width;
const sanitizedHeight =
    typeof props.height === "number" ? `${props.height}px` : props.height;
</script>
<template>
    <div
        :style="{
            width: sanitizedWidth,
            height: $props.circular ? sanitizedWidth : sanitizedHeight,
        }"
        class="met_skeleton__root"
        :class="{
            met_skeleton__circular: $props.circular,
            met_skeleton__xs: $props.xs,
            met_skeleton__sm: $props.sm,
            met_skeleton__lg: $props.lg,
            met_skeleton__xl: $props.xl,
            met_skeleton__h1: $props.h1,
            met_skeleton__h2: $props.h2,
            met_skeleton__h3: $props.h3,
            met_skeleton__h4: $props.h4,
        }"
    ></div>
</template>
<style>
.met_skeleton__root {
    @apply bg-gray-200 dark:bg-gray-600 animate-pulse rounded h-base;
}

.met_skeleton__circular {
    @apply rounded-full;
}

.met_skeleton__xs {
    @apply h-xs;
}

.met_skeleton__sm {
    @apply h-sm;
}

.met_skeleton__lg {
    @apply h-lg;
}

.met_skeleton__xl {
    @apply h-xl;
}

.met_skeleton__h1 {
    @apply h-h1;
}

.met_skeleton__h2 {
    @apply h-h2;
}

.met_skeleton__h3 {
    @apply h-h3;
}

.met_skeleton__h4 {
    @apply h-h4;
}
</style>
