<script setup lang="ts">
import type { StepItemProps } from "./types";
import MetStepPreview from "../../stepper/step-preview/MetStepPreview.vue";

defineProps<StepItemProps>();
</script>
<template>
    <div class="met_step__root">
        <div v-if="!disabled" class="met_step__stepper">
            <div
                class="met_step__icon__wrapper"
                :class="{
                    met_step__icon__wrapper_error: $props.error,
                    met_step__icon__wrapper_active: $props.active,
                    met_step__icon__wrapper_completed: $props.completed,
                }"
            >
                <component :is="$props.icon" class="met_step__icon" />
            </div>
            <div class="met_step__connector"></div>
        </div>
        <component
            :is="$slots.default"
            v-if="$props.active || $props.completed"
        />
        <MetStepPreview v-else :title="$props.title" />
    </div>
</template>
<style>
.met_step__root {
    @apply relative;
}

.met_step__root:last-child > .met_step__stepper > .met_step__connector {
    @apply hidden;
}

.met_step__stepper {
    @apply h-[calc(100%-38px)] absolute -translate-x-[78px] translate-y-2;
}

.met_step__icon__wrapper {
    @apply bg-gray-500 p-4 rounded-full;
}

.met_step__icon__wrapper_active {
    @apply bg-green;
}

.met_step__icon__wrapper_completed {
    @apply bg-white;
}

.met_step__icon__wrapper_error {
    @apply bg-yellow;
}

.met_step__root:last-child
    > .met_step__stepper
    > .met_step__icon__wrapper_active {
    @apply bg-blue;
}

.met_step__root:last-child
    > .met_step__stepper
    > .met_step__icon__wrapper_active
    > .met_step__icon {
    @apply text-white;
}

.met_step__connector {
    @apply h-full w-[1px] border-black border-r border-dashed absolute left-1/2 translate-y-[1px];
}

.met_step__content {
    @apply w-full;
}
</style>
