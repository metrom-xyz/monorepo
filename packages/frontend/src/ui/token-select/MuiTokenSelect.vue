<script setup lang="ts">
import type { TokenSelectProps } from "./types";
import MuiTextInput from "../MuiTextInput.vue";
import MuiRemoteLogo from "../remote-logo/MuiRemoteLogo.vue";
import MuiTokenSelectSearch from "./search/MuiTokenSelectSearch.vue";
import MuiModal from "../modal/MuiModal.vue";
import { computed } from "vue";
import TokenSelectIcon from "@/icons/TokenSelectIcon.vue";
import type { TokenInfo } from "@uniswap/token-lists";

const props = defineProps<TokenSelectProps>();

const emit = defineEmits<{
    dismiss: [];
}>();
const selected = defineModel<TokenInfo>();

function handleModalOnDismiss() {
    emit("dismiss");
}

function handleTokenOnChange(token?: TokenInfo) {
    if (!token) return;
    selected.value = token;
    emit("dismiss");
}

const selectedToken = computed(() => {
    if (!props.tokens || !selected.value) return null;

    return props.tokens.find(
        (token) =>
            token.address.toLowerCase() ===
            selected.value?.address.toLowerCase(),
    );
});
</script>
<template>
    <div class="mui_token_select__root" v-bind="{ ...$attrs }">
        <MuiModal :open="$props.open" :onDismiss="handleModalOnDismiss">
            <MuiTextInput
                iconLeft
                readonly
                :model-value="selectedToken?.symbol"
                :placeholder="$props.messages.inputPlaceholder"
                class="mui_token_select__input"
            >
                <template #icon>
                    <TokenSelectIcon v-if="!selectedToken" />
                    <MuiRemoteLogo
                        v-else
                        :address="selectedToken.address"
                        :defaultText="selectedToken.symbol"
                    />
                </template>
            </MuiTextInput>
            <template #modal>
                <MuiTokenSelectSearch
                    :tokens="$props.tokens"
                    :selected="selected?.address"
                    :messages="$props.messages.search"
                    @dismiss="handleModalOnDismiss"
                    @tokenChange="handleTokenOnChange"
                />
            </template>
        </MuiModal>
    </div>
</template>
<style>
.mui_token_select__root {
}

.mui_token_select__input {
    @apply hover:cursor-pointer;
}

/* text input customization */
.mui_token_select__root
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > input {
    @apply pl-14;
}

.mui_token_select__root
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > .mui_base_input_wrapper__icon__left {
    @apply left-1.5;
}
</style>
