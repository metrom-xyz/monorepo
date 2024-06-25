<script setup lang="ts">
import { ref } from "vue";
import MetAccordionSummary from "./summary/MetAccordionSummary.vue";
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
    props.expanded === undefined ? internalExpanded.value : props.expanded,
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
        class="met_accordion__root"
        :class="{
            met_accordion__root__active: detailsVisible,
        }"
    >
        <MetAccordionSummary
            :expanded="detailsVisible"
            @click="handleExpandOnClick"
            :expandIcon="$props.expandIcon"
            :class="{
                met_accordion__disabled: $props.disabled,
            }"
        >
            <slot name="summary"></slot>
        </MetAccordionSummary>
        <Collapse :when="!!detailsVisible">
            <div class="met_accordion__details">
                <slot></slot>
            </div>
        </Collapse>
    </div>
</template>
<style>
.met_accordion__root {
    @apply transition-colors
        duration-200
        ease-in-out
        border
        border-transparent
        rounded-[18px];
}

.met_accordion__disabled {
    @apply pointer-events-none opacity-50;
}

.met_accordion__root__active {
    @apply border-green;
}

.met_accordion__details {
    @apply p-2;
}
</style>
