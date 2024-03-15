<script setup lang="ts">
import MuiTypography from "../typography/MuiTypography.vue";
import MuiErrorText from "../error-text/MuiErrorText.vue";
import type { BaseInputWrapperProps } from "./types";
import { useAttrs } from "vue";

defineOptions({
    inheritAttrs: false,
});

defineSlots<{
    default: HTMLInputElement;
}>();

defineProps<BaseInputWrapperProps>();

const attrs = useAttrs();
</script>
<template>
    <div class="mui_base_input_wrapper__root">
        <label
            :for="attrs.id as string"
            v-if="!!$props.label"
            class="mui_base_input_wrapper__label"
        >
            <MuiTypography class="mui_base_input_wrapper__label__text">
                {{ $props.label }}
            </MuiTypography>
        </label>
        <div
            class="mui_base_input_wrapper__container"
            :class="{
                mui_base_input_wrapper__container__xs: $props.xs,
                mui_base_input_wrapper__container__sm: $props.sm,
                mui_base_input_wrapper__container__lg: $props.lg,
                mui_base_input_wrapper__container__xl: $props.xl,
                mui_base_input_wrapper__container__no__border:
                    $props.borderless,
                mui_base_input_wrapper__container__error: !!$props.error,
                mui_base_input_wrapper__container__loading: $props.loading,
                mui_base_input_wrapper__container__left_icon: $props.iconLeft,
            }"
        >
            <div
                v-if="!!$props.icon && $props.iconLeft"
                class="mui_base_input_wrapper__icon mui_base_input_wrapper__icon__left"
            >
                <component :is="$props.icon" />
            </div>
            <div
                v-if="!!$props.action && !$props.actionRight"
                class="mui_base_input_wrapper__action mui_base_input_wrapper__action__left"
            >
                <component :is="$props.action" />
            </div>
            <slot></slot>
            <div
                v-if="!!$props.icon && !$props.iconLeft"
                class="mui_base_input_wrapper__icon mui_base_input_wrapper__icon__right"
            >
                <component :is="$props.icon" />
            </div>
            <div
                v-if="!!$props.action && $props.actionRight"
                class="mui_base_input_wrapper__action mui_base_input_wrapper__action__right"
            >
                <component :is="$props.action" />
            </div>
        </div>
        <MuiErrorText
            v-if="typeof $props.error === 'string'"
            v-bind="{
                xs: $props.xs,
                sm: $props.sm,
                lg: $props.lg,
                xl: $props.xl,
            }"
            class="mui_base_input_wrapper__error_text"
        >
            {{ $props.error }}
        </MuiErrorText>
    </div>
</template>
<style>
.mui_base_input_wrapper__root {
    @apply w-full;
}

.mui_base_input_wrapper__label {
    @apply flex items-center gap-1.5 w-fit mb-2.5 ml-4;
}

.mui_base_input_wrapper__info_icon {
    @apply w-4 h-4 text-black;
}

.mui_base_input_wrapper__info_popover {
    @apply px-3 py-2;
}

.mui_base_input_wrapper__container {
    @apply w-full relative;
}

.mui_base_input_wrapper__container > input {
    @apply w-full
        text-base
        rounded-xxl
        p-4
        font-inter
        font-normal
        focus:outline-none
        placeholder-gray-400
        border-2
        border-transparent
        text-black
        focus:border-green
        bg-gray-300;
}

.mui_base_input_wrapper__container__xs > input {
    @apply text-xs;
}

.mui_base_input_wrapper__container__sm > input {
    @apply text-sm;
}

.mui_base_input_wrapper__container__lg > input {
    @apply text-lg;
}

.mui_base_input_wrapper__container__xl > input {
    @apply text-xl;
}

.mui_base_input_wrapper__container__error > input {
    @apply bg-red/20;
}

.mui_base_input_wrapper__container__left_icon > input {
    @apply pl-12;
}

.mui_base_input_wrapper__container__loading > input {
    @apply bg-gray-300 animate-pulse;
}

.mui_base_input_wrapper__icon {
    @apply absolute top-0 h-full w-12 flex justify-center items-center pointer-events-none;
}

.mui_base_input_wrapper__icon > svg {
    @apply w-5 text-black;
}

.mui_base_input_wrapper__icon__left {
    @apply left-0;
}

.mui_base_input_wrapper__icon__right {
    @apply right-0;
}

.mui_base_input_wrapper__action__left {
    @apply left-3;
}

.mui_base_input_wrapper__action__right {
    @apply right-3;
}

.mui_base_input_wrapper__action {
    @apply absolute top-0 h-full flex justify-center items-center;
}

.mui_base_input_wrapper__error_text {
    @apply ml-4;
}

/* customize children styles */
.mui_popover__root {
    @apply p-2;
}
</style>
