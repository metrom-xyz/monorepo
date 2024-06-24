<script setup lang="ts" generic="T extends SelectOption<ValueType>">
import { computed, ref, useAttrs, watchPostEffect, type Component } from "vue";
import { useVirtualList, watchDebounced } from "@vueuse/core";
import MetTextInput from "../MetTextInput.vue";
import MetChrevronUpIcon from "../../icons/ChrevronUpIcon.vue";
import MetChevronDownIcon from "../../icons/ChevronDownIcon.vue";
import type { SelectOption, SelectProps, ValueType } from "./types";
import MetPopover from "../popover/MetPopover.vue";
import MetTypography from "../typography/MetTypography.vue";
import MetSelectRow from "./row/MetSelectRow.vue";

defineSlots<{
    option?: Component<{ option: T & { selected: boolean } }>;
}>();
const props = defineProps<SelectProps<T>>();
const emit = defineEmits<{
    change: [option: T];
}>();
const attrs = useAttrs();

const root = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const query = ref("");
const debouncedQuery = ref("");
const open = ref(false);

const items = computed<T[]>(() =>
    props.options.filter((option) =>
        option.label.toLowerCase().includes(debouncedQuery.value.toLowerCase()),
    ),
);

const inputValue = computed(() => {
    if (open.value && props.search) return query.value;
    if (!props.search && props.selected?.value) return props.selected.label;
    return null;
});

function handleQueryOnChange(value: string) {
    query.value = value;
}

function handleOptionOnClick(option: T) {
    emit("change", option);
    open.value = false;
}

const { containerProps, wrapperProps, list } = useVirtualList(items, {
    itemHeight: props.optionHeight || 48,
});

watchDebounced(
    query,
    () => {
        debouncedQuery.value = query.value;
    },
    { debounce: 300 },
);

watchPostEffect((onCleanup) => {
    function handleCloseOnMouseDown(event: MouseEvent) {
        if (
            dropdownRef.value &&
            event.button === 0 &&
            !dropdownRef.value.contains(event.target as HTMLElement)
        )
            open.value = false;
    }

    if (open.value) {
        document.addEventListener("mousedown", handleCloseOnMouseDown);
    }

    onCleanup(() => {
        document.removeEventListener("mousedown", handleCloseOnMouseDown);
    });
});
</script>
<template>
    <div class="met_select__root" ref="root">
        <MetPopover :open="open" placement="bottom-start" :offset="8">
            <!-- FIXME: fix issue when select is in search mode -->
            <MetTextInput
                v-bind="{
                    xs: $props.xs,
                    sm: $props.sm,
                    lg: $props.lg,
                    xl: $props.xl,
                    disabled: $props.loading || attrs.disabled,
                    loading: $props.loading,
                    label: $props.label,
                    error: $props.error,
                    borderless: $props.borderless,
                    info: $props.info,
                    readonly: !$props.search,
                    ...attrs,
                }"
                v-model="inputValue"
                iconLeft
                actionRight
                :icon="$props.icon"
                :action="open ? MetChrevronUpIcon : MetChevronDownIcon"
                @click="open = !open"
                @input="handleQueryOnChange($event.target.value)"
                class="met_select__input"
            />
            <template #popover>
                <div
                    ref="dropdownRef"
                    :style="{
                        width: `${root?.firstElementChild?.firstElementChild?.clientWidth}px`,
                    }"
                >
                    <div
                        class="met_select__list__wrapper"
                        v-bind="containerProps"
                    >
                        <div v-if="list.length > 0" v-bind="wrapperProps">
                            <MetSelectRow
                                v-for="{ index, data } in list"
                                :key="index"
                                :label="data.label"
                                :selected="
                                    !!props.selected &&
                                    props.selected.value === data.value
                                "
                                @click="handleOptionOnClick(data)"
                            >
                                <template v-if="!!$slots.option" #option>
                                    <slot
                                        name="option"
                                        :option="{
                                            ...data,
                                            selected:
                                                !!props.selected &&
                                                props.selected.value ===
                                                    data.value,
                                        }"
                                    ></slot>
                                </template>
                            </MetSelectRow>
                        </div>
                        <div v-else class="met_select__empty__list">
                            <MetTypography>
                                {{ $props.messages.noResults }}
                            </MetTypography>
                        </div>
                    </div>
                </div>
            </template>
        </MetPopover>
    </div>
</template>
<style>
.met_select__input {
    @apply hover:cursor-pointer;
}

.met_select__empty__list {
    @apply flex justify-center items-center p-3 h-12;
}

.met_select__list__wrapper {
    @apply w-full
        h-full
        max-h-48
        rounded-lg
        bg-white
        z-20
        overflow-hidden;
}
</style>
