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
        <Transition name="met_popover__fade">
            <div
                class="met_popover__root"
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
.met_popover__root {
    @apply inline-block rounded-xl bg-white z-50 shadow-lg p-0;
}

.met_popover__fade-enter-active,
.met_popover__fade-leave-active {
    @apply transition-opacity duration-200 ease-in-out;
}

.met_popover__fade-enter-from,
.met_popover__fade-leave-to {
    @apply opacity-0;
}
</style>
