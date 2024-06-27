<script setup lang="ts">
import type { AccordionSummaryProps } from "./types";

defineSlots<{
    default: unknown;
}>();
defineProps<AccordionSummaryProps>();
</script>
<template>
    <div
        class="met_accordion_summary__root"
        :class="{
            met_accordion_summary__root_expanded: $props.expanded,
            met_accordion_summary__root_collapsed: !$props.expanded,
        }"
    >
        <slot></slot>
        <component
            v-if="$props.expandIcon"
            :is="$props.expandIcon"
            class="met_accordion_summary__icon"
            :class="{
                met_accordion_summary__icon_expanded: $props.expanded,
            }"
        ></component>
    </div>
</template>
<style>
.met_accordion_summary__root {
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

.met_accordion_summary__root_expanded {
    @apply border-dashed border-gray-400;
}

.met_accordion_summary__root_collapsed {
    @apply bg-white;
}

.met_accordion_summary__icon {
    @apply transition-all duration-200 ease-in-out;
}

.met_accordion_summary__icon_expanded {
    @apply rotate-180;
}
</style>
