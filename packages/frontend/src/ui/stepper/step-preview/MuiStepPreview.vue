<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { StepPreviewProps } from "./types";

defineProps<StepPreviewProps>();
</script>
<template>
    <div class="mui_step_preview__root">
        <MuiTypography medium lg>{{ $props.title }}</MuiTypography>
    </div>
</template>
<style>
.mui_step_preview__root {
    @apply flex items-center bg-gray-200 w-full pt-6 pb-5 px-6 rounded-[30px];
}
</style>
