<script setup lang="ts">
import type { StepItemProps } from "./types";
import MuiStepPreview from "@/ui/stepper/step-preview/MuiStepPreview.vue";

defineProps<StepItemProps>();
</script>
<template>
    <div class="mui_step__root">
        <div v-if="!disabled" class="mui_step__stepper">
            <div
                class="mui_step__icon__wrapper"
                :class="{
                    mui_step__icon__wrapper_error: $props.error,
                    mui_step__icon__wrapper_active: $props.active,
                    mui_step__icon__wrapper_completed: $props.completed,
                }"
            >
                <component :is="$props.icon" class="mui_step__icon" />
            </div>
            <div class="mui_step__connector"></div>
        </div>
        <component
            :is="$slots.default"
            v-if="$props.active || $props.completed"
        />
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

.mui_step__icon__wrapper {
    @apply bg-gray-500 p-4 rounded-full;
}

.mui_step__icon__wrapper_active {
    @apply bg-green;
}

.mui_step__icon__wrapper_completed {
    @apply bg-white;
}

.mui_step__icon__wrapper_error {
    @apply bg-yellow;
}

.mui_step__root:last-child
    > .mui_step__stepper
    > .mui_step__icon__wrapper_active {
    @apply bg-blue;
}

.mui_step__root:last-child
    > .mui_step__stepper
    > .mui_step__icon__wrapper_active
    > .mui_step__icon {
    @apply text-white;
}

.mui_step__connector {
    @apply h-full w-[1px] border-black border-r border-dashed absolute left-1/2 translate-y-[1px];
}

.mui_step__content {
    @apply w-full;
}
</style>
