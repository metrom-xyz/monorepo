<script setup lang="ts">
import type { ChipsProps } from "./types";

const props = withDefaults(defineProps<ChipsProps>(), {
    sm: true,
});
</script>
<template>
    <div
        class="met_chip__root"
        :class="{
            met_chip__root__clickable: props.clickable,
            met_chip__root__active: props.active,
            met_chip__root__sm: props.sm,
            met_chip__root__lg: props.lg,
        }"
    >
        <slot></slot>
    </div>
</template>
<style>
.met_chip__root {
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

.met_chip__root__clickable {
    @apply cursor-pointer hover:bg-green-200;
}

.met_chip__root__active {
    @apply cursor-pointer bg-green-200;
}

.met_chip__root__sm {
    @apply py-1 px-2;
}

.met_chip__root__lg {
    @apply py-3 px-4;
}
</style>
