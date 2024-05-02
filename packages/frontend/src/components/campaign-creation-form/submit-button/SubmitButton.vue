<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { SubmitButtonProps } from "./types";

const props = defineProps<SubmitButtonProps>();
defineSlots<{
    default: string;
}>();
</script>
<template>
    <button
        :disabled="$props.disabled || $props.loading"
        @click="$props.onClick"
        class="submit_button__root"
        :class="{
            submit_button__root_loading: $props.loading,
        }"
    >
        <div class="submit_button__content">
            <div
                class="submit_button__icon__wrapper submit_button__icon__wrapper_invisible"
            ></div>
            <MuiTypography medium class="submit_button__text">
                <slot></slot>
            </MuiTypography>
            <div
                class="submit_button__icon__wrapper"
                :class="{ submit_button__icon__wrapper_invisible: !props.icon }"
            >
                <component v-if="props.icon" :is="$props.icon"></component>
            </div>
        </div>
    </button>
</template>
<style>
.submit_button__root {
    @apply bg-blue w-full px-4 py-3 rounded-[30px] disabled:bg-gray-600 disabled:hover:cursor-not-allowed;
}

.submit_button__root_loading {
    @apply animate-pulse;
}

.submit_button__content {
    @apply flex items-center justify-between;
}

.submit_button__text {
    @apply text-white;
}

.submit_button__icon__wrapper {
    @apply h-[58px] w-[58px] p-4 rounded-full border border-white;
}

.submit_button__icon__wrapper_invisible {
    @apply invisible;
}

.submit_button__icon__wrapper > svg {
    @apply text-white;
}

.submit_button__icon_hidden {
    @apply invisible;
}
</style>
