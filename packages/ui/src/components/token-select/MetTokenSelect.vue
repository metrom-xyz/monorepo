<script setup lang="ts">
import type { TokenSelectProps } from "./types";
import MetTextInput from "../MetTextInput.vue";
import MetRemoteLogo from "../remote-logo/MetRemoteLogo.vue";
import MetTokenSelectSearch from "./search/MetTokenSelectSearch.vue";
import MetModal from "../modal/MetModal.vue";
import { computed } from "vue";
import TokenSelectIcon from "../../icons/TokenSelectIcon.vue";
import { type TokenInfo } from "../../types";
import { ref } from "vue";

const props = defineProps<TokenSelectProps>();

const emits = defineEmits<{
    dismiss: [];
    searchQueryChange: [query?: string];
}>();
const selected = defineModel<TokenInfo>();

const tokenSearchQuery = ref();

const selectedToken = computed(() => {
    if (!selected.value) return null;

    return props.tokens.find(
        (token) =>
            token.address.toLowerCase() ===
            selected.value?.address.toLowerCase(),
    );
});

function handleModalOnDismiss() {
    emits("dismiss");
}

function handleTokenOnChange(token?: TokenInfo) {
    if (!token) return;
    selected.value = token;
    emits("dismiss");
}

function handleSearchQueryChange(query?: string) {
    tokenSearchQuery.value = query;
    emits("searchQueryChange", query);
}
</script>
<template>
    <div class="met_token_select__root" v-bind="{ ...$attrs }">
        <MetModal :open="$props.open" :onDismiss="handleModalOnDismiss">
            <MetTextInput
                iconLeft
                readonly
                :error="$props.error"
                :model-value="selectedToken?.symbol"
                :placeholder="$props.messages.placeholder"
                class="met_token_select__input"
            >
                <template #icon>
                    <TokenSelectIcon v-if="!selectedToken" />
                    <MetRemoteLogo
                        v-else
                        :src="selectedToken.logoURI"
                        :address="selectedToken.address"
                        :defaultText="selectedToken.symbol"
                    />
                </template>
            </MetTextInput>
            <template #modal>
                <MetTokenSelectSearch
                    :tokens="$props.tokens"
                    :selected="selected?.address"
                    :loadingTokens="loadingTokens"
                    :loadingBalances="loadingBalances"
                    :messages="$props.messages.search"
                    :optionDisabled="$props.optionDisabled"
                    @dismiss="handleModalOnDismiss"
                    @tokenChange="handleTokenOnChange"
                    @searchQueryChange="handleSearchQueryChange"
                />
            </template>
        </MetModal>
    </div>
</template>
<style>
.met_token_select__input {
    @apply hover:cursor-pointer;
}

/* text input customization */
.met_token_select__root
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container__left_icon
    > input {
    @apply pl-14;
}

.met_token_select__root
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container__left_icon
    > .met_base_input_wrapper__icon__left {
    @apply left-1.5;
}
</style>
