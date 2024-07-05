<script setup lang="ts">
import { MetCard, MetTypography } from "@metrom-xyz/ui";
import type { Component } from "vue";

const props = defineProps<{
    icon: Component;
    title: string;
    description?: string;
    href?: string;
}>();

const baseComponent = props.href ? "a" : "div";
const linkProps = {
    href: props.href,
    target: "_blank",
    rel: "noopener noreferrer",
};
</script>
<template>
    <component
        :is="baseComponent"
        v-bind="{ ...($props.href ? linkProps : {}) }"
        class="info__card__root"
    >
        <MetCard>
            <template #content>
                <div class="info__card">
                    <component :is="$props.icon" class="info__card__icon" />
                    <MetTypography lg>
                        {{ $props.title }}
                    </MetTypography>
                    <MetTypography v-if="$props.description">
                        {{ $props.description }}
                    </MetTypography>
                </div>
            </template>
        </MetCard>
    </component>
</template>
<style>
.info__card__root {
    @apply w-fit;
}

.info__card {
    @apply flex
        flex-col
        items-center
        justify-center
        sm:w-40
        sm:h-44
        w-28
        h-32
        rounded-[40px];
}

.info__card__icon {
    @apply h-12 w-12 sm:h-20 sm:w-20 mb-2;
}
</style>
