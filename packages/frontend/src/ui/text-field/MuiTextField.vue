<script setup lang="ts">
import MuiTypography from "../typography/MuiTypography.vue";
import type { MuiTextFieldProps } from "./types";

defineProps<MuiTextFieldProps>();
</script>
<template>
    <div class="mui_text_field__root">
        <MuiTypography uppercase xs class="mui_text_field__label">
            {{ $props.label }}
        </MuiTypography>
        <MuiTypography>
            {{ $props.value }}
        </MuiTypography>
    </div>
</template>
<style>
.mui_text_field__root {
    @apply flex flex-col;
}

.mui_text_field__label {
    @apply text-gray-700;
}
</style>
