<script setup lang="ts">
import MetTextInput from "../../MetTextInput.vue";
import type { TokenSelectSearchProps } from "./types";
import { onMounted, ref } from "vue";
import { watchDebounced, useVirtualList } from "@vueuse/core";
import { computed } from "vue";
import { filterTokens, sortERC20Tokens } from "../../../utils/tokens";
import MetTypography from "../../typography/MetTypography.vue";
import XIcon from "../../../icons/XIcon.vue";
import SearchIcon from "../../../icons/SearchIcon.vue";
import type { TokenInfo } from "../../../types";
import MetTokenSelectSearchRow from "./row/MetTokenSelectSearchRow.vue";
import MetSkeleton from "../../skeleton/MetSkeleton.vue";

const props = defineProps<TokenSelectSearchProps>();
const emits = defineEmits<{
    tokenChange: [token?: TokenInfo];
    searchQueryChange: [query?: string];
    dismiss: [];
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
        emits("searchQueryChange", debouncedQuery.value);
    },
    { debounce: 300 },
);

const items = computed<TokenInfo[]>(() => {
    if (!props.tokens) return [];
    return sortERC20Tokens(filterTokens(props.tokens, debouncedQuery.value));
});

const { containerProps, wrapperProps, list } = useVirtualList(items, {
    itemHeight: 64,
});

function disableOption(token: TokenInfo) {
    if (!props.optionDisabled) return false;
    return props.optionDisabled(token);
}

function handleOnDismissClick() {
    emits("dismiss");
    emits("searchQueryChange");
}

onMounted(() => {
    if (searchInputRef.value?.input) searchInputRef.value.input.focus();
});
</script>
<template>
    <div class="met_token_select_search__root">
        <div class="met_token_select_search__header">
            <div class="met_token_select_search__title">
                <MetTypography lg medium>
                    {{ $props.messages.label }}
                </MetTypography>
                <XIcon
                    @click="handleOnDismissClick"
                    class="met_token_select_search__close__icon"
                />
            </div>
            <MetTextInput
                ref="searchInputRef"
                id="token-search"
                :disabled="$props.loadingTokens"
                :placeholder="$props.messages.placeholder"
                :icon="SearchIcon"
                iconLeft
                v-model="searchQuery"
            />
        </div>
        <div class="met_token_select_search__list__header">
            <MetTypography sm>{{ $props.messages.token }}</MetTypography>
            <MetTypography sm>
                {{ $props.messages.minimumDistributionRate }}
            </MetTypography>
            <MetTypography sm>{{ $props.messages.balance }}</MetTypography>
        </div>
        <div
            class="met_token_select_search__list__container"
            v-bind="containerProps"
        >
            <div
                v-if="
                    ($props.loadingTokens || $props.loadingBalances) &&
                    !$props.tokens
                "
                class="met_token_select_search__list__wrapper"
            >
                <div
                    :key="n"
                    v-for="n in 4"
                    class="met_token_select_search__skeleton"
                >
                    <MetSkeleton :height="32" :width="125" />
                    <MetSkeleton :height="32" :width="60" />
                    <MetSkeleton :height="32" :width="60" />
                </div>
            </div>
            <div
                v-else-if="$props.tokens && $props.tokens.length > 0"
                v-bind="wrapperProps"
                class="met_token_select_search__list__wrapper"
            >
                <MetTokenSelectSearchRow
                    v-for="{ index, data } in list"
                    :key="index"
                    :selected="
                        !!$props.selected &&
                        $props.selected.toLowerCase() ===
                            data.address.toLowerCase()
                    "
                    :loadingToken="$props.loadingTokens"
                    :loadingBalance="$props.loadingBalances"
                    :disabled="disableOption(data)"
                    @click="emits('tokenChange', data)"
                    v-bind="{ ...data }"
                />
            </div>
            <div
                v-else-if="$props.tokens && $props.tokens.length === 0"
                class="met_token_select_search__list__wrapper__empty"
            >
                <MetTypography>
                    {{ $props.messages.noTokens }}
                </MetTypography>
            </div>
        </div>
    </div>
</template>
<style>
.met_token_select_search__root {
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

.met_token_select_search__header {
    @apply flex
        flex-col
        gap-5
        justify-between
        p-5;
}

.met_token_select_search__title {
    @apply flex justify-between items-center;
}

/* text input customization */
.met_token_select_search__header
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container__left_icon
    > input {
    @apply pl-14;
}

.met_token_select_search__header
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container__left_icon
    > .met_base_input_wrapper__icon__left {
    @apply left-1.5;
}

.met_token_select_search__close__icon {
    @apply self-end hover:cursor-pointer;
}

.met_token_select_search__list_header {
    @apply flex justify-between w-full border-gray-400 border-b border-dashed;
}

.met_token_select_search__list_header > p {
    @apply text-gray-600;
}

.met_token_select_search__list__header {
    @apply grid
        grid-cols-tokenSelectHeader
        gap-8
        w-full
        border-gray-400
        border-b
        px-8;
}

.met_token_select_search__list__header > p {
    @apply text-gray-600;
}

.met_token_select_search__list__header > :not(:first-child) {
    @apply text-right;
}

.met_token_select_search__list__container {
    @apply flex flex-col gap-6;
}

.met_token_select_search__list__wrapper {
    @apply flex flex-col gap-1;
}

.met_token_select_search__list__wrapper__empty {
    @apply flex justify-center items-center;
}

.met_token_select_search__skeleton {
    @apply flex justify-between p-3;
}
</style>
