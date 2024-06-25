<script setup lang="ts">
import MetTypography from "../typography/MetTypography.vue";
import MetErrorText from "../error-text/MetErrorText.vue";
import type { BaseInputWrapperProps } from "./types";
import { ref, useAttrs } from "vue";
import type { Component } from "vue";
import MetPopover from "../popover/MetPopover.vue";
import MetInfoIcon from "../../icons/InfoIcon.vue";

defineOptions({
    inheritAttrs: false,
});

defineSlots<{
    default: HTMLInputElement;
    icon: Component;
}>();

defineProps<BaseInputWrapperProps>();

const attrs = useAttrs();

const popover = ref(false);
</script>
<template>
    <div class="met_base_input_wrapper__root">
        <label
            :for="attrs.id as string"
            v-if="!!$props.label"
            class="met_base_input_wrapper__label"
        >
            <MetTypography class="met_base_input_wrapper__label__text">
                {{ $props.label }}
            </MetTypography>
            <MetPopover v-if="!!$props.info" :open="popover">
                <MetInfoIcon
                    class="met_base_input_wrapper__info__icon"
                    @mouseenter="popover = true"
                    @mouseleave="popover = false"
                />
                <template #popover>
                    <div class="met_base_input_wrapper__info__popover">
                        <MetTypography>
                            {{ $props.info }}
                        </MetTypography>
                    </div>
                </template>
            </MetPopover>
        </label>
        <div
            class="met_base_input_wrapper__container"
            :class="{
                met_base_input_wrapper__container__xs: $props.xs,
                met_base_input_wrapper__container__sm: $props.sm,
                met_base_input_wrapper__container__lg: $props.lg,
                met_base_input_wrapper__container__xl: $props.xl,
                met_base_input_wrapper__container__error: !!$props.error,
                met_base_input_wrapper__container__loading: $props.loading,
                met_base_input_wrapper__container__left_icon: $props.iconLeft,
            }"
        >
            <div
                v-if="(!!$props.icon || !!$slots.icon) && $props.iconLeft"
                class="met_base_input_wrapper__icon met_base_input_wrapper__icon__left"
            >
                <component :is="$props.icon || $slots.icon" />
            </div>
            <div
                v-if="!!$props.action && !$props.actionRight"
                class="met_base_input_wrapper__action met_base_input_wrapper__action__left"
            >
                <component :is="$props.action" />
            </div>
            <slot></slot>
            <div
                v-if="(!!$props.icon || !!$slots.icon) && !$props.iconLeft"
                class="met_base_input_wrapper__icon met_base_input_wrapper__icon__right"
            >
                <component :is="$props.icon || $slots.icon" />
            </div>
            <div
                v-if="!!$props.action && $props.actionRight"
                class="met_base_input_wrapper__action met_base_input_wrapper__action__right"
            >
                <component :is="$props.action" />
            </div>
        </div>
        <MetErrorText
            v-if="typeof $props.error === 'string'"
            v-bind="{
                xs: $props.xs,
                sm: $props.sm,
                lg: $props.lg,
                xl: $props.xl,
            }"
            class="met_base_input_wrapper__error_text"
        >
            {{ $props.error }}
        </MetErrorText>
    </div>
</template>
<style>
.met_base_input_wrapper__root {
    @apply w-full;
}

.met_base_input_wrapper__label {
    @apply flex items-center gap-1.5 w-fit mb-2.5 ml-4;
}

.met_base_input_wrapper__info__icon {
    @apply w-4 h-4 text-black;
}

.met_base_input_wrapper__info__popover {
    @apply px-3 py-2;
}

.met_base_input_wrapper__container {
    @apply w-full relative;
}

.met_base_input_wrapper__container > input {
    @apply w-full
        text-base
        rounded-xxl
        p-4
        font-inter
        font-normal
        disabled:cursor-not-allowed
        focus:outline-none
        placeholder-gray-600
        border
        border-transparent
        text-black
        focus:border-green
        bg-gray-100
        transition-colors
        duration-200
        ease-in-out;
}

.met_base_input_wrapper__container__xs > input {
    @apply text-xs;
}

.met_base_input_wrapper__container__sm > input {
    @apply text-sm;
}

.met_base_input_wrapper__container__lg > input {
    @apply text-lg;
}

.met_base_input_wrapper__container__xl > input {
    @apply text-xl;
}

.met_base_input_wrapper__container__left_icon > input {
    @apply pl-14;
}

.met_base_input_wrapper__container__error > input {
    @apply border-red-light focus:border-red-light;
}

.met_base_input_wrapper__container__loading {
    @apply bg-gray-100/10 animate-pulse;
}

.met_base_input_wrapper__icon {
    @apply absolute top-0 h-full w-12 flex justify-center items-center pointer-events-none;
}

.met_base_input_wrapper__icon > svg {
    @apply text-black;
}

.met_base_input_wrapper__icon__left {
    @apply left-1.5;
}

.met_base_input_wrapper__icon__right {
    @apply right-0;
}

.met_base_input_wrapper__action__left {
    @apply left-3;
}

.met_base_input_wrapper__action__right {
    @apply right-3;
}

.met_base_input_wrapper__action {
    @apply absolute top-0 h-full flex justify-center items-center;
}

/* customize children styles */
.met_popover__root {
    @apply p-2;
}
</style>
