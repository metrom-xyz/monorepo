<script setup lang="ts">
import type { TabProps } from "./types";

const props = defineProps<TabProps>();
defineSlots<{
    default?: unknown;
}>();

function handleTabOnClick() {
    if (!props.onClick) return;
    props.onClick(props.value || 0);
}
</script>
<template>
    <button class="mui_tab__root" @click="handleTabOnClick">
        <slot></slot>
    </button>
</template>
<style>
.mui_tab__root {
    @apply w-full p-3.5 rounded-xl transition-opacity duration-200 ease-in-out;
}
</style>
