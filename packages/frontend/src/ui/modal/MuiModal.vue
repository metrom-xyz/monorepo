<script setup lang="ts">
import { ref, watchPostEffect } from "vue";
import type { ModalProps } from "./types";

defineSlots<{
    default: unknown;
    modal: unknown;
}>();

const emit = defineEmits<{
    dismiss: [];
}>();
const props = defineProps<ModalProps>();

const contentRef = ref<HTMLElement | null>(null);

const handleCloseOnClick = (event: MouseEvent) => {
    if (
        props.open &&
        contentRef.value &&
        event.button === 0 &&
        !contentRef.value.contains(event.target as HTMLElement)
    )
        emit("dismiss");
};

const handleCloseOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") emit("dismiss");
};

watchPostEffect((onCleanup) => {
    if (props.open) {
        document.addEventListener("mousedown", handleCloseOnClick);
        document.addEventListener("keydown", handleCloseOnKeyDown);
    }

    onCleanup(() => {
        document.removeEventListener("mousedown", handleCloseOnClick);
        document.removeEventListener("keydown", handleCloseOnKeyDown);
    });
});
</script>
<template>
    <slot></slot>
    <Teleport to="body">
        <Transition name="mui_modal__fade">
            <div class="mui_modal__root" v-if="props.open">
                <span ref="contentRef">
                    <slot name="modal"> </slot>
                </span>
            </div>
        </Transition>
    </Teleport>
</template>
<style scoped>
.mui_modal__root {
    @apply fixed
        top-0
        left-0
        w-screen
        h-screen
        z-50
        flex
        justify-center
        items-center
        bg-black/30
        transition-opacity;
}

.mui_modal__fade-enter-active,
.mui_modal__fade-leave-active {
    @apply transition-opacity;
}

.mui_modal__fade-enter-from,
.mui_modal__fade-leave-to {
    @apply opacity-0;
}
</style>
