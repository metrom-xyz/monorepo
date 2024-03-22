<script setup lang="ts" generic="T extends AccordionSelectOption<ValueType>">
import type {
    AccordionSelectOption,
    AccordionSelectProps,
    ValueType,
} from "./types";
import MuiOption from "./option/MuiOption.vue";
import MuiTypography from "../typography/MuiTypography.vue";
import MuiAccordion from "../accordion/MuiAccordion.vue";

const props = defineProps<AccordionSelectProps<T>>();
const emit = defineEmits<{
    change: [option: T];
}>();

function handleOptionOnClick(option: T) {
    emit("change", option);
}
</script>
<template>
    <div class="mui_accordion_select__root">
        <MuiAccordion
            class="mui_accordion_select__accordion"
            :disabled="$props.disabled"
        >
            <template #summary>
                <div
                    v-if="props.selected"
                    class="mui_accordion_select__summary"
                >
                    <component
                        :is="props.selected.icon"
                        class="mui_accordion_select__selected_icon"
                    ></component>
                    <div class="mui_accordion_select__selected_label">
                        <MuiTypography xs uppercase>
                            {{ $props.label }}
                        </MuiTypography>
                        <MuiTypography>
                            {{ props.selected.label }}
                        </MuiTypography>
                    </div>
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
                    <MuiTypography uppercase>{{ $props.label }}</MuiTypography>
                </div>
            </template>
            <div class="mui_accordion_select__options_wrapper">
                <MuiOption
                    :key="index"
                    v-for="(option, index) in $props.options"
                    :label="option.label"
                    :icon="option.icon"
                    :selected="props.selected?.value === option.value"
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

.mui_accordion_select__summary_placeholder_icon {
    @apply w-6 h-6;
}

.mui_accordion_select__options_wrapper {
    @apply flex flex-col;
}
</style>
