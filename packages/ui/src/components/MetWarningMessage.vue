<script setup lang="ts">
import { ref } from "vue";
import MetPopover from "./popover/MetPopover.vue";

defineSlots<{
    default: unknown;
    popover?: unknown;
}>();

const open = ref(false);
</script>
<template>
    <div
        @mouseenter="open = true"
        @mouseleave="open = false"
        class="met_warning_message__root"
        :class="{ met_warning_message__root_hover: !!$slots.popover }"
    >
        <MetPopover :open="!!$slots.popover && open" :placement="'right-end'">
            <slot></slot>
            <template v-if="!!$slots.popover" #popover>
                <div class="met_warning_message__popover__wrapper">
                    <slot name="popover"></slot>
                </div>
            </template>
        </MetPopover>
    </div>
</template>
<style>
.met_warning_message__root {
    @apply bg-yellow py-2 px-3 rounded-lg w-fit;
}

.met_warning_message__root_hover {
    @apply hover:cursor-pointer;
}

.met_warning_message__popover__wrapper {
    @apply flex flex-col rounded-lg bg-yellow gap-2 p-3 max-w-96;
}
</style>
