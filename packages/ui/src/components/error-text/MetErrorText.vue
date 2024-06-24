<script setup lang="ts">
import type { ErrorTextProps } from "./types";
import MetTypography from "../typography/MetTypography.vue";

defineSlots<{
    default?: string;
}>();

defineProps<ErrorTextProps>();
</script>
<template>
    <span class="met_error_text__root">
        <MetTypography v-bind="$props" class="met_error_text__typograhpy">
            <slot></slot>
        </MetTypography>
    </span>
</template>
<style>
.met_error_text__root {
    @apply flex items-center gap-2 mt-2 w-fit;
}

.met_error_text__icon {
    @apply w-6;
}

.met_error_text__typograhpy {
    @apply text-red-light;
}
</style>
