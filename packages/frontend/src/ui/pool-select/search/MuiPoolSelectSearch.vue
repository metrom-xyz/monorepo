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
import MuiChip from "@/ui/chip/MuiChip.vue";
import { CHAIN_DATA } from "@/commons";
import { useSelectedChain } from "@/composables/useSelectedChain";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import type { Address } from "viem";

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

const chain = useSelectedChain();

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
            <div v-if="chain" class="mui_pool_select_search__list__populars">
                <MuiChip
                    clickable
                    :active="debouncedQuery === token.address"
                    :key="token.address"
                    v-for="token in CHAIN_DATA[chain].popularTokens"
                    @click="handleOnPopularTokenClick(token.address)"
                >
                    <div class="mui_pool_select_search__list__popular__chip">
                        <MuiRemoteLogo
                            :address="token.address"
                            :defaultText="token.symbol"
                        />
                        <MuiTypography lg>{{ token.symbol }}</MuiTypography>
                    </div>
                </MuiChip>
            </div>
        </div>
        <div class="mui_pool_select_search__list__header">
            <MuiTypography sm>{{ $t("ui.poolSelect.pool") }}</MuiTypography>
            <MuiTypography uppercase sm>
                {{ $t("ui.poolSelect.tvl") }}
            </MuiTypography>
        </div>
        <div
            class="mui_pool_select_search__list__container"
            :class="{
                mui_pool_select_search_wrapper__empty: list.length === 0,
            }"
            v-bind="containerProps"
        >
            <div
                v-if="list.length > 0"
                v-bind="wrapperProps"
                class="mui_pool_select_search__list__wrapper"
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
        h-[600px]
        w-[440px]
        bg-white
        overflow-hidden
        rounded-[30px]
        border
        border-green;
}

.mui_pool_select_search__header {
    @apply flex flex-col gap-5 justify-between p-5;
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

.mui_pool_select_search__list__populars {
    @apply flex flex-wrap gap-2;
}

.mui_pool_select_search__list__popular__chip {
    @apply flex items-center gap-1.5;
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

.mui_pool_select_search__list__container {
    @apply flex flex-col gap-6;
}

.mui_pool_select_search__list__wrapper {
    @apply flex flex-col gap-1;
}

.mui_pool_select_search_wrapper__empty {
    @apply flex justify-center items-center;
}
</style>
