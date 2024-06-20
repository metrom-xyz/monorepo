<script setup lang="ts">
import MuiTextInput from "@/ui/MuiTextInput.vue";
import type { TokenSelectSearchProps } from "./types";
import { onMounted, ref } from "vue";
import { watchDebounced, useVirtualList } from "@vueuse/core";
import { computed } from "vue";
import { filterTokens, sortERC20Tokens } from "@/ui/utils/tokens";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import XIcon from "@/icons/XIcon.vue";
import SearchIcon from "@/icons/SearchIcon.vue";
import type { TokenInfo } from "@uniswap/token-lists";
import MuiTokenSelectSearchRow from "./row/MuiTokenSelectSearchRow.vue";
import MuiSkeleton from "@/ui/skeleton/MuiSkeleton.vue";

const props = defineProps<TokenSelectSearchProps>();
const emits = defineEmits<{
    tokenChange: [token?: TokenInfo];
    searchQueryChange: [query?: string];
    dismiss: [];
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
    <div class="mui_token_select_search__root">
        <div class="mui_token_select_search__header">
            <div class="mui_token_select_search__title">
                <MuiTypography lg medium>
                    {{ $props.messages.label }}
                </MuiTypography>
                <XIcon
                    @click="handleOnDismissClick"
                    class="mui_token_select_search__close__icon"
                />
            </div>
            <MuiTextInput
                ref="searchInputRef"
                id="token-search"
                :disabled="$props.loadingTokens"
                :placeholder="$props.messages.placeholder"
                :icon="SearchIcon"
                iconLeft
                v-model="searchQuery"
            />
        </div>
        <div
            class="mui_token_select_search__list__wrapper"
            v-bind="containerProps"
        >
            <div
                v-if="(loadingTokens || loadingBalances) && list.length === 0"
                class="mui_token_select_search__list__container"
            >
                <div
                    :key="n"
                    v-for="n in 4"
                    class="mui_token_select_search__skeleton"
                >
                    <MuiSkeleton :height="32" :width="125" />
                    <MuiSkeleton :height="32" :width="60" />
                </div>
            </div>
            <div
                v-else-if="list.length > 0"
                v-bind="wrapperProps"
                class="mui_token_select_search__list__container"
            >
                <MuiTokenSelectSearchRow
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
            <MuiTypography v-else>
                {{ $props.messages.noTokens }}
            </MuiTypography>
        </div>
    </div>
</template>
<style>
.mui_token_select_search__root {
    @apply flex
        flex-col
        h-[480px]
        w-[440px]
        bg-white
        rounded-[30px]
        border
        border-green;
}

.mui_token_select_search__header {
    @apply flex
        flex-col
        gap-5
        justify-between
        p-5;
}

.mui_token_select_search__title {
    @apply flex justify-between items-center;
}

/* text input customization */
.mui_token_select_search__header
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > input {
    @apply pl-14;
}

.mui_token_select_search__header
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > .mui_base_input_wrapper__icon__left {
    @apply left-1.5;
}

.mui_token_select_search__close__icon {
    @apply self-end hover:cursor-pointer;
}

.mui_token_select_search__list_header {
    @apply flex justify-between w-full border-gray-400 border-b border-dashed;
}

.mui_token_select_search__list_header > p {
    @apply text-gray-600;
}

.mui_token_select_search__list__wrapper {
    @apply flex flex-col gap-6 mx-5;
}

.mui_token_select_search__list__container {
    @apply flex flex-col gap-2;
}

.mui_token_select_search__skeleton {
    @apply flex justify-between p-3;
}
</style>
