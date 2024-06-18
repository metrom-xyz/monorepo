<script setup lang="ts">
import type { ErrorTextProps } from "./types";
import MuiTypography from "../typography/MuiTypography.vue";

defineSlots<{
    default?: string;
}>();

defineProps<ErrorTextProps>();
</script>
<template>
    <span class="mui_error_text__root">
        <MuiTypography v-bind="$props" class="mui_error_text__typograhpy">
            <slot></slot>
        </MuiTypography>
    </span>
</template>
<style>
.mui_error_text__root {
    @apply flex items-center gap-2 mt-2 w-fit;
}

.mui_error_text__icon {
    @apply w-6;
}

.mui_error_text__typograhpy {
    @apply text-red-light;
}
</style>
