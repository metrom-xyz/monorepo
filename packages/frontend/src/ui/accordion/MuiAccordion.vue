<script setup lang="ts">
import { ref } from "vue";
import MuiAccordionSummary from "./summary/MuiAccordionSummary.vue";
import { type AccordionProps } from "./types";
import { computed } from "vue";

defineSlots<{
    default: unknown;
    summary: unknown;
}>();

const props = withDefaults(defineProps<AccordionProps>(), {
    expanded: undefined,
});

let internalExpanded = ref(false);

const detailsVisible = computed(() =>
    props.expanded === undefined ? internalExpanded : props.expanded,
);

const handleExpandOnClick = (event: MouseEvent) => {
    if (props.onExpandToggle) {
        props.onExpandToggle(event, !detailsVisible.value);
    }
    if (props.expanded === undefined) {
        internalExpanded.value = !internalExpanded.value;
    }
};
</script>
<template>
    <div
        class="mui_accordion__root"
        :class="{
            mui_accordion__root__active: detailsVisible,
        }"
    >
        <MuiAccordionSummary
            :expanded="detailsVisible"
            @click="handleExpandOnClick"
            :expandIcon="$props.expandIcon"
            :class="{
                mui_accordion__disabled: $props.disabled,
            }"
        >
            <slot name="summary"></slot>
        </MuiAccordionSummary>
        <Transition name="mui_accordion">
            <div
                v-if="detailsVisible && !!$slots.default"
                class="mui_accordion__details"
            >
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>
<style>
/* @keyframes mui_accordion_height {
    0% {
        max-height: 0;
    }
    100% {
        max-height: 400px;
    }
}

.mui_accordion-enter-active {
    animation: mui_accordion_height 0.2s linear;
}

.mui_accordion-leave-active {
    animation: mui_accordion_height 0.2s linear reverse;
} */

.mui_accordion__root {
    @apply border-2 border-transparent rounded-[18px];
}

.mui_accordion__disabled {
    @apply pointer-events-none opacity-50;
}

.mui_accordion__root__active {
    @apply border-green;
}

.mui_accordion__details {
    @apply p-2;
}
</style>
