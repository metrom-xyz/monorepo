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
        w-48
        h-44
        gap-0.5
        rounded-[40px];
}

.info__card__icon {
    @apply h-[90px] w-[90px];
}
</style>
