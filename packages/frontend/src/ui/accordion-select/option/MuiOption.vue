<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { OptionProps } from "./types";

defineProps<OptionProps>();
</script>
<template>
    <div
        class="mui_option__root"
        :class="{ mui_option__root__selected: $props.selected }"
    >
        <component :is="$props.icon" class="mui_option__icon"></component>
        <MuiTypography>{{ $props.label }}</MuiTypography>
    </div>
</template>
<style>
.mui_option__root {
    @apply w-full flex items-center gap-4 p-4 rounded-xl hover:cursor-pointer hover:bg-green-light;
}

.mui_option__root__selected {
    @apply bg-green-light;
}

.mui_option__icon {
    @apply w-8 h-8;
}
</style>
