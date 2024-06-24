<script setup lang="ts" generic="V extends ListItem<ItemType>">
import { ref } from "vue";
import MetTextInput from "../MetTextInput.vue";
import type { ItemType, ListInputProps, ListItem } from "./types";
import MetTypography from "../typography/MetTypography.vue";
import { computed } from "vue";
import type { Component } from "vue";
import XIcon from "../../icons/XIcon.vue";
import MetErrorText from "../error-text/MetErrorText.vue";

defineSlots<{
    item?: Component<{ item: V; onRemove: () => void }>;
}>();
const props = defineProps<ListInputProps<V>>();
const emits = defineEmits<{
    change: [value: V[]];
}>();

const inputValue = ref<string>("");
const button = ref<HTMLElement | null>(null);
const error = ref();

// dynamic padding for the input, based on the length
// of the embedded button
const paddingRight = computed(() => {
    if (!button.value) return "16px";
    return `${button.value.clientWidth + 16}px`;
});

function addItemToList() {
    if (props.items.find((item) => item.value === inputValue.value)) {
        error.value = props.messages.error.duplicated;
        return;
    }

    if (props.max && props.items.length >= props.max) {
        error.value = props.messages.error.maximum;
        return;
    }

    const errorMessage = props.validate && props.validate(inputValue.value);
    error.value = errorMessage;

    if (!inputValue.value || error.value) return;

    emits("change", [
        ...props.items,
        { label: inputValue.value, value: inputValue.value } as V,
    ]);
    inputValue.value = "";
}

function handleOnKeyDown(event: KeyboardEvent) {
    if (event.key !== "Enter") return;
    addItemToList();
}

function handleRemoveOnClick(remove: V) {
    emits(
        "change",
        props.items.filter((item) => item.value !== remove.value),
    );
}
</script>
<template>
    <div class="met_list_input__root">
        <div class="met_list_input__error__wrapper">
            <div
                class="met_list_input__wrapper met_list_input__wrapper__padding"
            >
                <MetTextInput
                    v-model="inputValue"
                    :placeholder="$props.messages.placeholder"
                    @keydown="handleOnKeyDown"
                />
                <button
                    ref="button"
                    class="met_list_input__add__button"
                    :disabled="!inputValue"
                    @click="addItemToList"
                >
                    <MetTypography>{{ $props.messages.button }}</MetTypography>
                </button>
            </div>
            <MetErrorText v-if="error" sm>
                {{ error }}
            </MetErrorText>
        </div>
        <div v-if="$props.items.length > 0" class="met_list_input__list">
            <div
                :key="item.value"
                v-for="item in $props.items"
                class="met_list_input__list__item__wrapper"
            >
                <slot
                    v-if="!!$slots.item"
                    name="item"
                    :item="item"
                    :onRemove="() => handleRemoveOnClick(item)"
                ></slot>
                <div v-else class="met_list_input__list__item">
                    <MetTypography>{{ item.label }}</MetTypography>
                    <XIcon @click="handleRemoveOnClick(item)" />
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.met_list_input__root {
    @apply flex flex-col gap-4;
}

.met_list_input__error__wrapper {
    @apply flex flex-col;
}

.met_list_input__wrapper {
    @apply relative flex items-center;
}

.met_list_input__wrapper
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container
    > input {
    @apply bg-white border border-gray-300 focus:border-green;
}

.met_list_input__wrapper__padding
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container
    > input {
    padding-right: v-bind(paddingRight);
}

.met_list_input__add__button {
    @apply absolute
        right-0.5
        rounded-2xl
        bg-gray-100
        p-4
        disabled:cursor-not-allowed
        disabled:hover:bg-gray-100
        transition-colors
        duration-200
        ease-in-out
        hover:bg-gray-300;
}

.met_list_input__list {
    @apply flex flex-col max-h-[300px] overflow-y-auto;
}

.met_list_input__list__item__wrapper {
    @apply p-2;
}

.met_list_input__list__item__wrapper:not(:only-child):not(:last-child) {
    @apply border-b border-dashed border-gray-400;
}

.met_list_input__list__item {
    @apply flex items-center justify-between;
}
</style>
