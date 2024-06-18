<script setup lang="ts">
import { ref } from "vue";
import MuiAccordionSummary from "./summary/MuiAccordionSummary.vue";
import { type AccordionProps } from "./types";
import { computed } from "vue";
import { Collapse } from "vue-collapsed";

defineSlots<{
    default: unknown;
    summary: unknown;
}>();

const props = withDefaults(defineProps<AccordionProps>(), {
    expanded: undefined,
});

const internalExpanded = ref(false);
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
        <Collapse :when="!!detailsVisible">
            <div class="mui_accordion__details">
                <slot></slot>
            </div>
        </Collapse>
    </div>
</template>
<style>
.mui_accordion__root {
    @apply transition-colors
        duration-200
        ease-in-out
        border-2
        border-transparent
        rounded-[18px];
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
