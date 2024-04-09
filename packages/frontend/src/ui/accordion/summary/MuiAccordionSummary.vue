<script setup lang="ts">
import type { AccordionSummaryProps } from "./types";

defineSlots<{
    default: unknown;
}>();
const props = defineProps<AccordionSummaryProps>();
</script>
<template>
    <div
        class="mui_accordion_summary__root"
        :class="{
            mui_accordion_summary__root__expanded: props.expanded,
            mui_accordion_summary__root__collapsed: !props.expanded,
        }"
    >
        <slot></slot>
    </div>
</template>
<style>
.mui_accordion_summary__root {
    @apply hover:cursor-pointer
        rounded-[18px]
        flex 
        justify-between
        items-center
        select-none
        px-4
        py-3
        border-b
        border-transparent;
}

.mui_accordion_summary__root__expanded {
    @apply border-dashed border-gray-400;
}

.mui_accordion_summary__root__collapsed {
    @apply bg-white;
}
</style>
