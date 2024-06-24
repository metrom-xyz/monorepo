<script setup lang="ts">
import MetTypography from "../../typography/MetTypography.vue";
import type { StepPreviewProps } from "./types";

defineProps<StepPreviewProps>();
</script>
<template>
    <div class="met_step_preview__root">
        <MetTypography medium lg>{{ $props.title }}</MetTypography>
    </div>
</template>
<style>
.met_step_preview__root {
    @apply flex items-center bg-gray-200 w-full pt-6 pb-5 px-6 rounded-[30px];
}
</style>
