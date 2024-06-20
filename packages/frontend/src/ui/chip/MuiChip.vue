<script setup lang="ts">
import type { ChipsProps } from "./types";

const props = withDefaults(defineProps<ChipsProps>(), {
    sm: true,
});
</script>
<template>
    <div
        class="mui_chip__root"
        :class="{
            mui_chip__root__clickable: props.clickable,
            mui_chip__root__active: props.active,
            mui_chip__root__sm: props.sm,
            mui_chip__root__lg: props.lg,
        }"
    >
        <slot></slot>
    </div>
</template>
<style>
.mui_chip__root {
    @apply bg-transparent
        w-fit
        rounded-xxl
        border
        border-gray-400
        whitespace-nowrap
        transition-colors
        duration-200
        ease-in-out;
}

.mui_chip__root__clickable {
    @apply cursor-pointer hover:bg-green-200;
}

.mui_chip__root__active {
    @apply cursor-pointer bg-green-200;
}

.mui_chip__root__sm {
    @apply py-1 px-2;
}

.mui_chip__root__lg {
    @apply py-3 px-4;
}
</style>
