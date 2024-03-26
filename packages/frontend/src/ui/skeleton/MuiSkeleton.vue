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
        class="mui_skeleton__root"
        :class="{
            mui_skeleton__circular: $props.circular,
            mui_skeleton__xs: $props.xs,
            mui_skeleton__sm: $props.sm,
            mui_skeleton__lg: $props.lg,
            mui_skeleton__xl: $props.xl,
            mui_skeleton__h1: $props.h1,
            mui_skeleton__h2: $props.h2,
            mui_skeleton__h3: $props.h3,
            mui_skeleton__h4: $props.h4,
        }"
    ></div>
</template>
<style>
.mui_skeleton__root {
    @apply bg-gray-200 dark:bg-gray-600 animate-pulse rounded h-base;
}

.mui_skeleton__circular {
    @apply rounded-full;
}

.mui_skeleton__xs {
    @apply h-xs;
}

.mui_skeleton__sm {
    @apply h-sm;
}

.mui_skeleton__lg {
    @apply h-lg;
}

.mui_skeleton__xl {
    @apply h-xl;
}

.mui_skeleton__h1 {
    @apply h-h1;
}

.mui_skeleton__h2 {
    @apply h-h2;
}

.mui_skeleton__h3 {
    @apply h-h3;
}

.mui_skeleton__h4 {
    @apply h-h4;
}
</style>
