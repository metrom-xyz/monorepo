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
    met_button__icon__loading: props.loading,
    met_button__icon__only: !slots.default,
    met_button__icon__xs: props.xs,
    met_button__icon__sm: props.sm,
    met_button__icon__lg: props.lg,
};
</script>
<template>
    <component
        :is="baseComponent"
        class="met_button__root"
        :disabled="attrs.disabled || $props.loading"
        :class="{
            met_button__root__fill: $props.fill,
            met_button__root__xs: $props.xs,
            met_button__root__sm: $props.sm,
            met_button__root__lg: $props.lg,
            met_button__root__secondary: $props.secondary,
            met_button__root__active: $props.active,
        }"
    >
        <div
            v-if="!!$props.icon && !$props.iconRight"
            :class="baseButtonIconClasses"
        >
            <component :is="$props.icon" v-if="!$props.loading" />
            <SpinnerIcon v-else />
        </div>
        <span v-if="$slots.default" :class="baseButtonIconClasses">
            <div
                v-if="$props.loading && !$props.icon"
                class="met_button__spinning__icon__wrapper"
                :class="baseButtonIconClasses"
            >
                <SpinnerIcon />
            </div>
            <div
                :class="{
                    met_button__wrapper: $props.loading && !$props.icon,
                }"
            >
                <slot></slot>
            </div>
        </span>
        <div
            v-if="!!$props.icon && $props.iconRight"
            :class="baseButtonIconClasses"
        >
            <component :is="$props.icon" v-if="!$props.loading" />
            <SpinnerIcon v-else />
        </div>
    </component>
</template>
<style>
.met_button__root {
    @apply relative 
    w-fit 
    flex 
    items-center 
    justify-center 
    font-inter 
    cursor-pointer 
    transition-all
    ease-in-out 
    duration-200
    rounded-xxl
    bg-green
    hover:bg-green-600
    disabled:bg-gray-600
    disabled:hover:bg-gray-600
    disabled:hover:cursor-not-allowed;
}

.met_button__root div {
    @apply only:m-0 first:mr-2 last:ml-2;
}

.met_button__root__secondary {
    @apply w-fit text-white bg-blue hover:bg-blue-600;
}

.met_button__root__fill {
    @apply w-full;
}

.met_button__root__active {
    @apply bg-green border text-black hover:bg-black hover:text-white;
}

.met_button__root__lg {
    @apply px-6 py-5;
}

.met_button__root__sm {
    @apply px-6 py-4 text-sm;
}

.met_button__root__xs {
    @apply p-2 text-xs;
}

.met_button__wrapper {
    @apply invisible;
}

.met_button__spinning__icon__wrapper {
    @apply only:m-0 first:mr-2 last:ml-2 w-6 h-6 absolute left-1/2 transform -translate-x-1/2;
}

.met_button__spinning__icon__wrapper > svg {
    @apply animate-spin;
}

.met_button__icon__left > svg {
    @apply mr-2;
}

.met_button__icon__right > svg {
    @apply ml-2;
}

.met_button__icon__only > svg {
    @apply m-0;
}

.met_button__icon__lg > svg {
    @apply w-6 h-6;
}

.met_button__icon__xs > svg {
    @apply w-4 h-4;
}

.met_button__icon__sm > svg {
    @apply w-5 h-5;
}

.met_button__icon__loading > svg {
    @apply animate-spin;
}
</style>
