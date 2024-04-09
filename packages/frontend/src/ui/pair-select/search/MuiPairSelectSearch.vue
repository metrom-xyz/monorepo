<script setup lang="ts">
import MuiTextInput from "@/ui/MuiTextInput.vue";
import type { PairSelectSearchProps } from "./types";
import { ref } from "vue";
import { watchDebounced, useVirtualList } from "@vueuse/core";
import { computed } from "vue";
import { filterPairs } from "@/ui/utils/tokens";
import MuiPairSelectSearchRow from "./row/MuiPairSelectSearchRow.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { Pair } from "../types";
import XIcon from "@/icons/XIcon.vue";
import SearchIcon from "@/icons/SearchIcon.vue";

const props = defineProps<PairSelectSearchProps>();
const emit = defineEmits<{
    dismiss: [];
    pairChange: [pair: Pair];
}>();

const searchQuery = ref("");
const debouncedQuery = ref("");

watchDebounced(
    searchQuery,
    () => {
        debouncedQuery.value = searchQuery.value;
    },
    { debounce: 300 },
);

const items = computed<Pair[]>(() => {
    if (!props.pairs) return [];
    return filterPairs(props.pairs, debouncedQuery.value);
});

const { containerProps, wrapperProps, list } = useVirtualList(items, {
    itemHeight: 64,
});
</script>
<template>
    <div class="mui_pair_select_search__root">
        <div class="mui_pair_select_search__header">
            <XIcon
                @click="emit('dismiss')"
                class="mui_pair_select_search__close_icon"
            />
            <MuiTextInput
                id="token-search"
                :disabled="$props.loading"
                :label="$props.messages.inputLabel"
                :placeholder="$props.messages.inputPlaceholder"
                :icon="SearchIcon"
                iconLeft
                v-model="searchQuery"
            />
        </div>
        <div class="mui_pair_select_search__list_header">
            <MuiTypography sm>{{ $t("ui.pairSelect.pair") }}</MuiTypography>
            <MuiTypography uppercase sm>
                {{ $t("ui.pairSelect.tvl") }}
            </MuiTypography>
        </div>
        <div
            class="mui_pair_select_search__list_wrapper"
            :class="{
                mui_pair_select_search_wrapper__empty: list.length === 0,
            }"
            v-bind="containerProps"
        >
            <div
                v-if="list.length > 0"
                v-bind="wrapperProps"
                class="mui_pair_select_search__list_container"
            >
                <MuiPairSelectSearchRow
                    v-for="{ index, data } in list"
                    :key="index"
                    :selected="
                        !!$props.selected &&
                        $props.selected.id.toLowerCase() ===
                            data.id.toLowerCase()
                    "
                    :loading="$props.loading"
                    @click="emit('pairChange', data)"
                    v-bind="{ ...data }"
                />
            </div>
            <MuiTypography v-else>
                {{ $props.messages.noPairs }}
            </MuiTypography>
        </div>
    </div>
</template>
<style>
.mui_pair_select_search__root {
    @apply flex flex-col gap-4 h-[480px] w-[440px] bg-white px-8 py-5 rounded-[30px] border-2 border-green;
}

.mui_pair_select_search__header {
    @apply flex flex-col justify-between;
}

/* text input customization */
.mui_pair_select_search__header
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > input {
    @apply pl-14;
}

.mui_pair_select_search__header
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > .mui_base_input_wrapper__icon__left {
    @apply left-1.5;
}

.mui_pair_select_search__label {
    @apply mb-6;
}

.mui_pair_select_search__close_icon {
    @apply self-end hover:cursor-pointer;
}

.mui_pair_select_search__list_header {
    @apply flex justify-between w-full border-gray-400 border-b border-dashed;
}

.mui_pair_select_search__list_header > p {
    @apply text-gray-600;
}

.mui_pair_select_search__list_container {
    @apply flex flex-col gap-2;
}

.mui_pair_select_search__list_wrapper {
    @apply flex flex-col gap-6;
}

.mui_pair_select_search_wrapper__empty {
    @apply flex justify-center items-center;
}
</style>
