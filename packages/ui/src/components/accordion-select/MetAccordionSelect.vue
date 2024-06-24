<script setup lang="ts" generic="T extends AccordionSelectOption<ValueType>">
import type {
    AccordionSelectOption,
    AccordionSelectProps,
    ValueType,
} from "./types";
import MetAccordionSelectOption from "./option/MetAccordionSelectOption.vue";
import MetTypography from "../typography/MetTypography.vue";
import MetAccordion from "../accordion/MetAccordion.vue";
import { ref } from "vue";
import MetTextField from "../text-field/MetTextField.vue";

defineProps<AccordionSelectProps<T>>();
const selected = defineModel<T>();

const open = ref(false);

function handleOptionOnClick(option: T) {
    selected.value = option;
    open.value = false;
}

function handleAccordionOnToggle(_: MouseEvent, expanded: boolean) {
    open.value = expanded;
}
</script>
<template>
    <div class="met_accordion_select__root">
        <MetAccordion
            class="met_accordion_select__accordion"
            :disabled="$props.disabled"
            :expanded="open"
            :onExpandToggle="handleAccordionOnToggle"
        >
            <template #summary>
                <div
                    v-if="selected?.value"
                    class="met_accordion_select__summary"
                >
                    <component
                        :is="selected.icon"
                        class="met_accordion_select__selected_icon"
                    ></component>
                    <MetTextField
                        :label="$props.label"
                        :value="selected.label"
                    />
                </div>
                <div v-else class="met_accordion_select__summary">
                    <div
                        class="met_accordion_select__summary_placeholder_icon_wrapper"
                    >
                        <component
                            :is="$props.icon"
                            class="met_accordion_select__summary_placeholder_icon"
                        ></component>
                    </div>
                    <MetTypography
                        uppercase
                        class="met_accordion_select__label"
                    >
                        {{ $props.label }}
                    </MetTypography>
                </div>
            </template>
            <div class="met_accordion_select__options_wrapper">
                <MetAccordionSelectOption
                    :key="index"
                    v-for="(option, index) in $props.options"
                    :label="option.label"
                    :icon="option.icon"
                    :selected="selected?.value === option.value"
                    @click="handleOptionOnClick(option)"
                />
            </div>
        </MetAccordion>
    </div>
</template>
<style>
.met_accordion_select__accordion > .met_accordion_summary__root {
    @apply pl-[22px];
}

.met_accordion_select__summary {
    @apply h-[42px] flex gap-4 items-center;
}

.met_accordion_select__summary_placeholder_icon_wrapper {
    @apply p-1.5 bg-green rounded-full;
}

.met_accordion_select__selected_icon {
    @apply w-9 h-9;
}

.met_accordion_select__selected_label {
    @apply flex flex-col;
}

.met_accordion_select__label {
    @apply text-gray-700;
}

.met_accordion_select__summary_placeholder_icon {
    @apply w-6 h-6;
}

.met_accordion_select__options_wrapper {
    @apply flex flex-col gap-2;
}
</style>
