<script setup lang="ts">
import MetTypography from "../typography/MetTypography.vue";
import type { MetTextFieldProps } from "./types";

defineProps<MetTextFieldProps>();
</script>
<template>
    <div class="met_text_field__root">
        <MetTypography uppercase xs class="met_text_field__label">
            {{ $props.label }}
        </MetTypography>
        <MetTypography>
            {{ $props.value }}
        </MetTypography>
    </div>
</template>
<style>
.met_text_field__root {
    @apply flex flex-col;
}

.met_text_field__label {
    @apply text-gray-700;
}
</style>
