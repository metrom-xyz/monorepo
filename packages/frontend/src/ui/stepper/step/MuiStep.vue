<script setup lang="ts">
import MuiCard from "@/ui/MuiCard.vue";
import type { StepItemProps } from "./types";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiStepPreview from "@/ui/stepper/step-preview/MuiStepPreview.vue";

defineProps<StepItemProps>();
</script>
<template>
    <div class="mui_step__root">
        <div class="mui_step__stepper">
            <div
                class="mui_step__icon_wrapper"
                :class="{
                    mui_step__icon_wrapper__active: $props.active,
                    mui_step__icon_wrapper__completed: $props.completed,
                }"
            >
                <component :is="$props.icon" class="mui_step__icon" />
            </div>
            <div class="mui_step__connector"></div>
        </div>
        <MuiCard v-if="$props.active || $props.completed">
            <template #title>
                <MuiTypography medium h4>{{ $props.title }}</MuiTypography>
            </template>
            <template #content>
                <div class="mui_step__content">
                    <slot></slot>
                </div>
            </template>
        </MuiCard>
        <MuiStepPreview v-else :title="$props.title" />
    </div>
</template>
<style>
.mui_step__root {
    @apply relative;
}

.mui_step__root:last-child > .mui_step__stepper > .mui_step__connector {
    @apply hidden;
}

.mui_step__stepper {
    @apply h-[calc(100%-38px)] absolute -translate-x-[78px] translate-y-2;
}

.mui_step__icon_wrapper {
    @apply bg-gray-500 p-4 rounded-full;
}

.mui_step__icon_wrapper__active {
    @apply bg-green;
}

.mui_step__icon_wrapper__completed {
    @apply bg-white;
}

.mui_step__connector {
    @apply h-full w-[1px] border-black border-r border-dashed absolute left-1/2 translate-y-[1px];
}

.mui_step__content {
    @apply w-full;
}
</style>
