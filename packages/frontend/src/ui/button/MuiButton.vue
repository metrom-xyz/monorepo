<script setup lang="ts">
import { useAttrs, useSlots } from "vue";
import type { ButtonProps } from "./types";
import SpinnerIcon from "../../icons/SpinnerIcon.vue";

defineSlots<{
    default: unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const props = withDefaults(defineProps<ButtonProps>(), {
    lg: true,
});

const baseComponent = "href" in attrs ? "a" : "button";

const baseButtonIconClasses = {
    mui_button__icon__loading: props.loading,
    mui_button__icon__only: !slots.default,
    mui_button__icon__xs: props.xs,
    mui_button__icon__sm: props.sm,
    mui_button__icon__lg: props.lg,
};
</script>
<template>
    <component
        :is="baseComponent"
        class="mui_button__root"
        :disabled="attrs.disabled || props.loading"
        :class="{
            mui_button__root__xs: props.xs,
            mui_button__root__sm: props.sm,
            mui_button__root__lg: props.lg,
            mui_button__root__secondary: props.secondary,
            mui_button__root__active: props.active,
        }"
    >
        <div
            v-if="!!props.icon && !props.iconRight"
            :class="baseButtonIconClasses"
        >
            <component :is="props.icon" v-if="!props.loading" />
            <SpinnerIcon v-else />
        </div>
        <span v-if="$slots.default" :class="baseButtonIconClasses">
            <div
                v-if="props.loading && !props.icon"
                class="mui_button__spinning__icon__wrapper"
            >
                <SpinnerIcon />
            </div>
            <div
                :class="{
                    mui_button__wrapper: props.loading && !props.icon,
                }"
            >
                <slot></slot>
            </div>
        </span>
        <div
            v-if="!!props.icon && props.iconRight"
            :class="baseButtonIconClasses"
        >
            <component :is="props.icon" v-if="!props.loading" />
            <SpinnerIcon v-else />
        </div>
    </component>
</template>
<style>
.mui_button__root {
    @apply relative 
    w-fit 
    flex 
    items-center 
    justify-center 
    font-inter 
    cursor-pointer 
    transition-colors 
    rounded-xxl
    bg-green 
    disabled:bg-gray-400
    disabled:hover:cursor-not-allowed;
}

.mui_button__root div {
    @apply only:m-0 first:mr-2 last:ml-2;
}

.mui_button__root__secondary {
    @apply border-black text-black bg-white hover:bg-white;
}

.mui_button__root__active {
    @apply bg-green border text-black hover:bg-black hover:text-white;
}

.mui_button__root__lg {
    @apply px-6 py-5;
}

.mui_button__root__sm {
    @apply px-6 py-4 text-sm;
}

.mui_button__root__xs {
    @apply p-4 text-xs;
}

.mui_button__wrapper {
    @apply invisible;
}

.mui_button__spinning__icon__wrapper {
    @apply only:m-0 first:mr-2 last:ml-2 w-6 h-6 absolute left-1/2 transform -translate-x-1/2;
}

.mui_button__spinning__icon__wrapper > svg {
    @apply animate-spin;
}

.mui_button__icon__left > svg {
    @apply mr-2;
}

.mui_button__icon__right > svg {
    @apply ml-2;
}

.mui_button__icon__only > svg {
    @apply m-0;
}

.mui_button__icon__xs > svg {
    @apply w-4 h-4;
}

.mui_button__icon__sm > svg {
    @apply w-5 h-5;
}

.mui_button__icon__lg > svg {
    @apply w-6 h-6;
}

.mui_button__icon__loading > svg {
    @apply animate-spin;
}
</style>
