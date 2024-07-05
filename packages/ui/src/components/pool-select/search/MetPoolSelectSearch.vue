<script setup lang="ts">
import MetTextInput from "../../MetTextInput.vue";
import type { PoolSelectSearchProps } from "./types";
import { ref } from "vue";
import { watchDebounced, useVirtualList } from "@vueuse/core";
import { computed } from "vue";
import { filterPools } from "../../../utils/tokens";
import MetPoolSelectSearchRow from "./row/MetPoolSelectSearchRow.vue";
import MetTypography from "../../typography/MetTypography.vue";
import XIcon from "../../../icons/XIcon.vue";
import SearchIcon from "../../../icons/SearchIcon.vue";
import type { Pool } from "@metrom-xyz/sdk";
import { onMounted } from "vue";
import MetChip from "../../chip/MetChip.vue";
import MetRemoteLogo from "../../remote-logo/MetRemoteLogo.vue";
import type { Address } from "viem";

const props = defineProps<PoolSelectSearchProps>();
const emit = defineEmits<{
    dismiss: [];
    poolChange: [pool: Pool];
}>();

const searchQuery = ref("");
const debouncedQuery = ref("");
const searchInputRef = ref<InstanceType<typeof MetTextInput> | null | null>(
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

function handleOnPopularTokenClick(address: Address) {
    debouncedQuery.value = address;
    if (searchInputRef.value?.input) searchInputRef.value.input.value = "";
}

onMounted(() => {
    if (searchInputRef.value?.input) searchInputRef.value.input.focus();
});
</script>
<template>
    <div class="met_pool_select_search__root">
        <div class="met_pool_select_search__header">
            <div class="met_pool_select_search__title">
                <MetTypography lg medium>
                    {{ $props.messages.label }}
                </MetTypography>
                <XIcon
                    @click="emit('dismiss')"
                    class="met_pool_select_search__close__icon"
                />
            </div>
            <MetTextInput
                ref="searchInputRef"
                id="token-search"
                :disabled="$props.loading"
                :placeholder="$props.messages.placeholder"
                :icon="SearchIcon"
                iconLeft
                v-model="searchQuery"
            />
            <div
                v-if="$props.baseTokens && $props.baseTokens.length > 0"
                class="met_pool_select_search__list__populars"
            >
                <MetChip
                    clickable
                    :active="debouncedQuery === token.address"
                    :key="token.address"
                    v-for="token in $props.baseTokens"
                    @click="handleOnPopularTokenClick(token.address)"
                >
                    <div class="met_pool_select_search__list__popular__chip">
                        <MetRemoteLogo
                            :address="token.address"
                            :defaultText="token.symbol"
                        />
                        <MetTypography lg>{{ token.symbol }}</MetTypography>
                    </div>
                </MetChip>
            </div>
        </div>
        <div class="met_pool_select_search__list__header">
            <MetTypography sm>{{ $props.messages.pool }}</MetTypography>
            <MetTypography uppercase sm>
                {{ $props.messages.tvl }}
            </MetTypography>
        </div>
        <div
            class="met_pool_select_search__list__container"
            :class="{
                met_pool_select_search_wrapper__empty: list.length === 0,
            }"
            v-bind="containerProps"
        >
            <div
                v-if="list.length > 0"
                v-bind="wrapperProps"
                class="met_pool_select_search__list__wrapper"
            >
                <MetPoolSelectSearchRow
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
            <MetTypography v-else>
                {{ $props.messages.noPools }}
            </MetTypography>
        </div>
    </div>
</template>
<style>
.met_pool_select_search__root {
    @apply flex
        flex-col
        h-[600px]
        w-[440px]
        bg-white
        overflow-hidden
        rounded-[30px]
        border
        border-green;
}

.met_pool_select_search__header {
    @apply flex flex-col gap-5 justify-between p-5;
}

.met_pool_select_search__title {
    @apply flex justify-between items-center;
}

.met_pool_select_search__label {
    @apply mb-6;
}

.met_pool_select_search__close__icon {
    @apply self-end hover:cursor-pointer;
}

.met_pool_select_search__list__populars {
    @apply flex flex-wrap gap-2;
}

.met_pool_select_search__list__popular__chip {
    @apply flex items-center gap-1.5;
}

.met_pool_select_search__list__header {
    @apply flex
        justify-between
        w-full
        border-gray-400
        border-b
        px-8;
}

.met_pool_select_search__list__header > p {
    @apply text-gray-600;
}

.met_pool_select_search__list__container {
    @apply flex flex-col gap-6;
}

.met_pool_select_search__list__wrapper {
    @apply flex flex-col gap-1;
}

.met_pool_select_search_wrapper__empty {
    @apply flex justify-center items-center;
}
</style>
