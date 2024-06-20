<script setup lang="ts">
import MuiTextInput from "@/ui/MuiTextInput.vue";
import type { PoolSelectSearchProps } from "./types";
import { ref } from "vue";
import { watchDebounced, useVirtualList } from "@vueuse/core";
import { computed } from "vue";
import { filterPools } from "@/ui/utils/tokens";
import MuiPoolSelectSearchRow from "./row/MuiPoolSelectSearchRow.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import XIcon from "@/icons/XIcon.vue";
import SearchIcon from "@/icons/SearchIcon.vue";
import type { Pool } from "sdk";
import { onMounted } from "vue";

const props = defineProps<PoolSelectSearchProps>();
const emit = defineEmits<{
    dismiss: [];
    poolChange: [pool: Pool];
}>();

const searchQuery = ref("");
const debouncedQuery = ref("");
const searchInputRef = ref<InstanceType<typeof MuiTextInput> | null | null>(
    null,
);

watchDebounced(
    searchQuery,
    () => {
        debouncedQuery.value = searchQuery.value;
    },
    { debounce: 300 },
);

const items = computed<Pool[]>(() => {
    if (!props.pools) return [];
    return filterPools(props.pools, debouncedQuery.value);
});

const { containerProps, wrapperProps, list } = useVirtualList(items, {
    itemHeight: 64,
});

onMounted(() => {
    if (searchInputRef.value?.input) searchInputRef.value.input.focus();
});
</script>
<template>
    <div class="mui_pool_select_search__root">
        <div class="mui_pool_select_search__header">
            <div class="mui_pool_select_search__title">
                <MuiTypography lg medium>
                    {{ $props.messages.label }}
                </MuiTypography>
                <XIcon
                    @click="emit('dismiss')"
                    class="mui_pool_select_search__close__icon"
                />
            </div>
            <MuiTextInput
                ref="searchInputRef"
                id="token-search"
                :disabled="$props.loading"
                :placeholder="$props.messages.placeholder"
                :icon="SearchIcon"
                iconLeft
                v-model="searchQuery"
            />
        </div>
        <div class="mui_pool_select_search__list__header">
            <MuiTypography sm>{{ $t("ui.poolSelect.pool") }}</MuiTypography>
            <MuiTypography uppercase sm>
                {{ $t("ui.poolSelect.tvl") }}
            </MuiTypography>
        </div>
        <div
            class="mui_pool_select_search__list__wrapper"
            :class="{
                mui_pool_select_search_wrapper__empty: list.length === 0,
            }"
            v-bind="containerProps"
        >
            <div
                v-if="list.length > 0"
                v-bind="wrapperProps"
                class="mui_pool_select_search__list__container"
            >
                <MuiPoolSelectSearchRow
                    v-for="{ index, data } in list"
                    :key="index"
                    :selected="
                        !!$props.selected &&
                        $props.selected.address.toLowerCase() ===
                            data.address.toLowerCase()
                    "
                    :loading="$props.loading"
                    @click="emit('poolChange', data)"
                    v-bind="{ ...data }"
                />
            </div>
            <MuiTypography v-else>
                {{ $props.messages.noPools }}
            </MuiTypography>
        </div>
    </div>
</template>
<style>
.mui_pool_select_search__root {
    @apply flex
        flex-col
        h-[480px]
        w-[440px]
        bg-white
        rounded-[30px]
        border
        border-green;
}

.mui_pool_select_search__header {
    @apply flex flex-col gap-4 justify-between p-5;
}

.mui_pool_select_search__title {
    @apply flex justify-between items-center;
}

.mui_pool_select_search__label {
    @apply mb-6;
}

.mui_pool_select_search__close__icon {
    @apply self-end hover:cursor-pointer;
}

.mui_pool_select_search__list__header {
    @apply flex
        justify-between
        w-full
        border-gray-400
        border-b
        px-8;
}

.mui_pool_select_search__list__header > p {
    @apply text-gray-600;
}

.mui_pool_select_search__list__wrapper {
    @apply flex flex-col gap-6 mx-5;
}

.mui_pool_select_search__list__container {
    @apply flex flex-col gap-2;
}

.mui_pool_select_search_wrapper__empty {
    @apply flex justify-center items-center;
}
</style>
