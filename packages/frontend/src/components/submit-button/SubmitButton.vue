<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import type { SubmitButtonProps } from "./types";

withDefaults(defineProps<SubmitButtonProps>(), { variant: "base" });
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
            submit_button__root_submit: $props.variant === 'submit',
            submit_button__root_success: $props.variant === 'success',
        }"
    >
        <div class="submit_button__content">
            <div
                class="submit_button__icon__wrapper"
                :class="{
                    submit_button__icon__wrapper_base:
                        $props.variant === 'base',
                    submit_button__icon__wrapper_submit:
                        $props.variant === 'submit',
                    submit_button__icon__wrapper_success:
                        $props.variant === 'success',
                    submit_button__icon__wrapper_invisible:
                        !$props.icon || !$props.iconLeft,
                }"
            >
                <component v-if="$props.icon" :is="$props.icon"></component>
            </div>
            <MetTypography
                medium
                class="submit_button__text"
                :class="{
                    submit_button__text_submit: $props.variant === 'submit',
                    submit_button__text_success: $props.variant === 'success',
                }"
            >
                <slot></slot>
            </MetTypography>
            <div
                class="submit_button__icon__wrapper"
                :class="{
                    submit_button__icon__wrapper_base:
                        $props.variant === 'base',
                    submit_button__icon__wrapper_submit:
                        $props.variant === 'submit',
                    submit_button__icon__wrapper_success:
                        $props.variant === 'success',
                    submit_button__icon__wrapper_invisible:
                        !$props.icon || $props.iconLeft,
                }"
            >
                <component v-if="$props.icon" :is="$props.icon"></component>
            </div>
        </div>
    </button>
</template>
<style>
.submit_button__root {
    @apply w-full
        px-4
        py-3
        bg-white
        hover:bg-gray-200
        rounded-[30px]
        disabled:bg-gray-600
        transition-colors
        duration-200
        ease-in-out
        disabled:hover:cursor-not-allowed;
}

.submit_button__root_submit {
    @apply bg-blue hover:bg-blue-600;
}

.submit_button__root_success {
    @apply bg-green hover:bg-green-600;
}

.submit_button__root_loading {
    @apply animate-pulse;
}

.submit_button__content {
    @apply flex items-center justify-between;
}

.submit_button__text {
    @apply text-black;
}

.submit_button__text_submit {
    @apply text-white;
}

.submit_button__text_success {
    @apply text-black;
}

.submit_button__icon__wrapper {
    @apply flex
        items-center
        h-[52px]
        w-[52px]
        p-3.5
        rounded-full
        border
        border-white;
}

.submit_button__icon__wrapper_base {
    @apply border-black;
}

.submit_button__icon__wrapper_submit {
    @apply border-white;
}

.submit_button__icon__wrapper_success {
    @apply border-black;
}

.submit_button__icon__wrapper_invisible {
    @apply invisible;
}

.submit_button__icon__wrapper_base > svg {
    @apply text-black;
}

.submit_button__icon__wrapper_submit > svg {
    @apply text-white;
}

.submit_button__icon__wrapper_success > svg {
    @apply text-black;
}

.submit_button__icon_hidden {
    @apply invisible;
}
</style>
