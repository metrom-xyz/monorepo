<script setup lang="ts">
import MetTypography from "../../typography/MetTypography.vue";
import type { OptionProps } from "./types";

defineProps<OptionProps>();
</script>
<template>
    <div
        class="met_option__root"
        :class="{ met_option__root__selected: $props.selected }"
    >
        <component :is="$props.icon" class="met_option__icon"></component>
        <MetTypography>{{ $props.label }}</MetTypography>
    </div>
</template>
<style>
.met_option__root {
    @apply w-full
        flex
        items-center
        gap-4
        p-4
        rounded-xl
        hover:cursor-pointer
        transition-colors
        duration-200
        ease-in-out
        hover:bg-green-200;
}

.met_option__root__selected {
    @apply bg-green-200;
}

.met_option__icon {
    @apply w-8 h-8;
}
</style>
