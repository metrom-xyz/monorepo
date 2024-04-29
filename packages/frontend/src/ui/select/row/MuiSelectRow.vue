<script setup lang="ts" generic="T extends SelectOption<ValueType>">
import type { Component } from "vue";
import type { SelectOption, ValueType } from "../types";
import type { SelectRowProps } from "./types";

defineSlots<{
    option?: Component<{ option: T }>;
}>();
const props = defineProps<SelectRowProps<T>>();
</script>
<template>
    <div v-if="!!$slots.option">
        <slot name="option"></slot>
    </div>
    <div
        v-else
        class="cui_select_row__root"
        :class="{ cui_select_row__root__selected: props.selected }"
    >
        {{ props.label }}
    </div>
</template>
<style>
.cui_select_row__root {
    @apply cursor-pointer
        p-3
        h-12
        font-inter
        font-normal
        outline-none
        placeholder-opacity-20
        text-black
        hover:bg-gray-200;
}

.cui_select_row__root__selected {
    @apply bg-gray-300 hover:bg-gray-300;
}
</style>
