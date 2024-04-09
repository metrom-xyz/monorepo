<script setup lang="ts" generic="T extends AccordionSelectOption<ValueType>">
import type {
    AccordionSelectOption,
    AccordionSelectProps,
    ValueType,
} from "./types";
import MuiOption from "./option/MuiOption.vue";
import MuiTypography from "../typography/MuiTypography.vue";
import MuiAccordion from "../accordion/MuiAccordion.vue";
import { ref } from "vue";
import MuiTextField from "../text-field/MuiTextField.vue";

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
    <div class="mui_accordion_select__root">
        <MuiAccordion
            class="mui_accordion_select__accordion"
            :disabled="$props.disabled"
            :expanded="open"
            :onExpandToggle="handleAccordionOnToggle"
        >
            <template #summary>
                <div
                    v-if="selected?.value"
                    class="mui_accordion_select__summary"
                >
                    <component
                        :is="selected.icon"
                        class="mui_accordion_select__selected_icon"
                    ></component>
                    <MuiTextField
                        :label="$props.label"
                        :value="selected.label"
                    />
                </div>
                <div v-else class="mui_accordion_select__summary">
                    <div
                        class="mui_accordion_select__summary_placeholder_icon_wrapper"
                    >
                        <component
                            :is="$props.icon"
                            class="mui_accordion_select__summary_placeholder_icon"
                        ></component>
                    </div>
                    <MuiTypography
                        uppercase
                        class="mui_accordion_select__label"
                    >
                        {{ $props.label }}
                    </MuiTypography>
                </div>
            </template>
            <div class="mui_accordion_select__options_wrapper">
                <MuiOption
                    :key="index"
                    v-for="(option, index) in $props.options"
                    :label="option.label"
                    :icon="option.icon"
                    :selected="selected?.value === option.value"
                    @click="handleOptionOnClick(option)"
                />
            </div>
        </MuiAccordion>
    </div>
</template>
<style>
.mui_accordion_select__accordion > .mui_accordion_summary__root {
    @apply pl-[22px];
}

.mui_accordion_select__summary {
    @apply h-[42px] flex gap-4 items-center;
}

.mui_accordion_select__summary_placeholder_icon_wrapper {
    @apply p-1.5 bg-green rounded-full;
}

.mui_accordion_select__selected_icon {
    @apply w-9 h-9;
}

.mui_accordion_select__selected_label {
    @apply flex flex-col;
}

.mui_accordion_select__label {
    @apply text-gray-700;
}

.mui_accordion_select__summary_placeholder_icon {
    @apply w-6 h-6;
}

.mui_accordion_select__options_wrapper {
    @apply flex flex-col;
}
</style>
