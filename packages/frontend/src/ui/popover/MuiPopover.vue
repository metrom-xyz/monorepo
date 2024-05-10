<script setup lang="ts">
import {
    useFloating,
    offset as offsetMiddleware,
    flip,
    shift,
    autoUpdate,
} from "@floating-ui/vue";
import type { PopoverProps } from "./types";
import { ref } from "vue";

defineSlots<{
    default: unknown;
    popover: unknown;
}>();

const props = defineProps<PopoverProps>();

const anchor = ref<HTMLElement | null>(null);
const popover = ref<HTMLElement | null>(null);

const { floatingStyles } = useFloating(anchor, popover, {
    placement: props.placement,
    open: props.open,
    middleware: [offsetMiddleware(props.offset), flip(), shift()],
    whileElementsMounted: autoUpdate,
});
</script>
<template>
    <div ref="anchor">
        <slot></slot>
    </div>
    <Teleport to="body">
        <Transition name="mui_popover__fade">
            <div
                class="mui_popover__root"
                v-if="props.open"
                ref="popover"
                role="tooltip"
                :style="floatingStyles"
            >
                <slot name="popover"></slot>
            </div>
        </Transition>
    </Teleport>
</template>
<style scoped>
.mui_popover__root {
    @apply inline-block rounded-xl border bg-white z-10 shadow-lg p-0;
}

.mui_popover__fade-enter-active,
.mui_popover__fade-leave-active {
    @apply transition-opacity;
}

.mui_popover__fade-enter-from,
.mui_popover__fade-leave-to {
    @apply opacity-0;
}
</style>
