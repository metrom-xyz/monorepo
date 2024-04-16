<script setup lang="ts">
import type { TokenSelectProps } from "./types";
import MuiTextInput from "../MuiTextInput.vue";
import MuiRemoteLogo from "../remote-logo/MuiRemoteLogo.vue";
import MuiTokenSelectSearch from "./search/MuiTokenSelectSearch.vue";
import MuiModal from "../modal/MuiModal.vue";
import { computed } from "vue";
import TokenSelectIcon from "@/icons/TokenSelectIcon.vue";
import type { TokenInfo } from "@uniswap/token-lists";
import { useAccount, useChainId, useReadContracts } from "vevm";
import { useTokens } from "@/stores/tokens";
import type { TokenInfoWithBalance } from "@/components/campaign-creation-form/rewards/types";
import { erc20Abi, type Address } from "viem";

defineProps<TokenSelectProps>();

const emit = defineEmits<{
    dismiss: [];
}>();
const selected = defineModel<TokenInfo>();

const account = useAccount();
const chainId = useChainId();
const tokensInChain = useTokens().getTokens(
    chainId.value,
) as TokenInfoWithBalance[];

const { data: rawBalances, loading: loadingBalances } = useReadContracts({
    contracts:
        (account.value.isConnected &&
            account.value.address &&
            tokensInChain.map((token) => {
                return {
                    abi: erc20Abi,
                    address: token.address as Address,
                    functionName: "balanceOf",
                    args: [account.value.address],
                };
            })) ||
        [],
    allowFailure: true,
});

function handleModalOnDismiss() {
    emit("dismiss");
}

function handleTokenOnChange(token?: TokenInfo) {
    if (!token) return;
    selected.value = token;
    emit("dismiss");
}

const tokensWithBalance = computed(() => {
    const tokensInChainWithBalance = tokensInChain.reduce(
        (accumulator: Record<string, TokenInfoWithBalance>, token, i) => {
            if (!rawBalances.value?.[i]) return accumulator;

            const rawBalance = rawBalances.value[i];
            accumulator[`${token.address.toLowerCase()}-${token.chainId}`] =
                rawBalance.status !== "failure"
                    ? {
                          ...token,
                          balance: rawBalance.result as bigint,
                      }
                    : token;
            return accumulator;
        },
        {},
    );

    return tokensInChain.map((token) => {
        const tokenWithBalance =
            tokensInChainWithBalance[
                `${token.address.toLowerCase()}-${token.chainId}`
            ];
        return tokenWithBalance || token;
    });
});

const selectedToken = computed(() => {
    if (!tokensWithBalance.value || !selected.value) return null;

    return tokensWithBalance.value.find(
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
                :error="$props.error"
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
                    :tokens="tokensWithBalance"
                    :selected="selected?.address"
                    :loading="!tokensInChain"
                    :loadingBalances="loadingBalances"
                    :messages="$props.messages.search"
                    :optionDisabled="$props.optionDisabled"
                    @dismiss="handleModalOnDismiss"
                    @tokenChange="handleTokenOnChange"
                />
            </template>
        </MuiModal>
    </div>
</template>
<style>
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
