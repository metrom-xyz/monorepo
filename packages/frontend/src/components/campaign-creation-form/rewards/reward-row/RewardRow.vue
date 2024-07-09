<script setup lang="ts">
import {
    MetTokenSelect,
    MetNumberInput,
    type TokenInfo,
    type NumberMaskValue,
} from "@metrom-xyz/ui";
import type { RewardRowProps } from "./types";
import { ref } from "vue";
import RemoveXIcon from "@/icons/RemoveXIcon.vue";
import { useAttrs } from "vue";
import { watchEffect } from "vue";
import { watch } from "vue";
import { formatUnits, parseUnits } from "viem";
import { formatDecimals } from "@metrom-xyz/sdk";
import { useAccount } from "vevm";
import { computed } from "vue";
import { onUnmounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<RewardRowProps>();
const emits = defineEmits<{
    insufficientBalance: [address: string, value: boolean];
    rewardRateTooLow: [address: string, value: boolean];
    searchQueryChange: [query?: string];
}>();
const tokenModel = defineModel<TokenInfo>("token");
const amountModel = defineModel<bigint>("amount");

const account = useAccount();
const attrs = useAttrs();
const { t } = useI18n();

const open = ref<boolean>();
const amountError = ref("");
const reward = ref<{
    symbol: string;
    amount: string;
    balance: string;
    insufficient: boolean;
}>();

// keep the reactivity on the tokens to react when the balances
// are fetched after the reward has been picked
const computedTokens = computed(() => props.tokens);

const minimumRewardAmount = computed(() => {
    if (
        !props.state.range ||
        !props.state.range.from ||
        !props.state.range.to ||
        !tokenModel.value ||
        !tokenModel.value.minimumRate
    )
        return 0;

    const campaignDuration = props.state.range.to.diff(
        props.state.range.from,
        "seconds",
    );

    return (
        (Number(
            formatUnits(
                tokenModel.value.minimumRate,
                tokenModel.value.decimals,
            ),
        ) /
            3_600) *
        campaignDuration
    );
});

const rewardRateTooLow = computed(() => {
    if (
        !props.state.range ||
        !props.state.range.from ||
        !props.state.range.to ||
        !tokenModel.value ||
        !tokenModel.value.minimumRate ||
        !amountModel.value
    )
        return false;

    const campaignDuration = props.state.range.to.diff(
        props.state.range.from,
        "seconds",
    );

    if (campaignDuration <= 0) return false;

    return (
        (amountModel.value * 3_600n) / BigInt(campaignDuration) <
        tokenModel.value.minimumRate
    );
});

watch([rewardRateTooLow, tokenModel], () => {
    if (!tokenModel.value?.address) return;

    emits("rewardRateTooLow", tokenModel.value.address, rewardRateTooLow.value);
});

// when the tokens property changes, inject the token balance for the reward
// in order to trigger the validation when the wallet is connected
watch(computedTokens, (tokens) => {
    if (!tokenModel.value) return;
    tokenModel.value.balance = tokens.find(
        (token) => token.address === tokenModel.value?.address,
    )?.balance;
});

watch(
    [tokenModel, amountModel, computedTokens],
    () => {
        if (
            !account.value.isConnected ||
            !tokenModel.value ||
            !amountModel.value ||
            tokenModel.value.balance === undefined ||
            tokenModel.value.balance === null
        )
            return;

        reward.value = {
            symbol: tokenModel.value.symbol,
            amount: formatDecimals({
                number: formatUnits(
                    amountModel.value,
                    tokenModel.value.decimals,
                ),
                decimalsAmount: 10,
            }),
            balance: formatDecimals({
                number: formatUnits(
                    tokenModel.value.balance,
                    tokenModel.value.decimals,
                ),
                decimalsAmount: 10,
            }),
            insufficient: amountModel.value > tokenModel.value.balance,
        };
    },
    { immediate: false },
);

watch([amountModel, reward, rewardRateTooLow], () => {
    amountError.value = rewardRateTooLow.value
        ? t("campaign.rewards.lowRate.label", {
              symbol: tokenModel.value?.symbol.toUpperCase(),
              minimumRewardAmount: formatDecimals({
                  number: minimumRewardAmount.value.toString(),
                  decimalsAmount: 3,
              }),
          })
        : reward.value?.insufficient
          ? t("campaign.rewards.insufficientBalance.label")
          : "";
});

watchEffect(() => {
    if (reward.value === undefined || !tokenModel.value) return;
    if (reward.value.insufficient)
        emits("insufficientBalance", tokenModel.value.address, true);
    else emits("insufficientBalance", tokenModel.value.address, false);
});

function handleRewardOnTokenRemove() {
    if (!props.onRemove || attrs.index === undefined) return;
    props.onRemove(attrs.index as number);
}

function handleRewardAmountOnChange(mask: NumberMaskValue) {
    if (!tokenModel.value) return;
    amountModel.value = parseUnits(mask.value, tokenModel.value.decimals);
}

onUnmounted(() => {
    if (!tokenModel.value) return;
    emits("insufficientBalance", tokenModel.value.address, false);
});
</script>
<template>
    <div class="reward_row__root">
        <div class="reward_row__wrapper">
            <div class="reward_row__token__select__wrapper">
                <MetTokenSelect
                    v-model="tokenModel"
                    :tokens="$props.tokens"
                    :open="open"
                    :loadingTokens="$props.loadingTokens"
                    :loadingBalances="$props.loadingBalances"
                    :messages="{
                        placeholder: $t('campaign.rewards.select.placeholder'),
                        search: {
                            label: $t('campaign.rewards.select.search.label'),
                            placeholder: $t(
                                'campaign.rewards.select.search.placeholder',
                            ),
                            noTokens: $t(
                                'campaign.rewards.select.search.noTokens',
                            ),
                        },
                    }"
                    :optionDisabled="
                        (token) =>
                            !!$props.rewards.find(
                                (reward) =>
                                    reward.token?.address === token.address,
                            )
                    "
                    @dismiss="open = undefined"
                    @click="open = true"
                    @searchQueryChange="emits('searchQueryChange', $event)"
                />
            </div>
            <div class="reward_row__token__amount__input__wrapper">
                <MetNumberInput
                    :disabled="!tokenModel"
                    :placeholder="$t('campaign.rewards.amount')"
                    class="reward_row__token__amount__input"
                    @update:modelValue="handleRewardAmountOnChange"
                    :error="amountError || false"
                />
            </div>
            <RemoveXIcon
                class="reward_row__remove__icon"
                :class="{
                    reward_row__remove__icon_hidden:
                        $props.rewards.length === 1 && $attrs.index === 0,
                }"
                @click="handleRewardOnTokenRemove"
            />
        </div>
    </div>
</template>
<style>
.reward_row__root {
    @apply flex flex-col gap-2 items-end;
}

.reward_row__wrapper {
    @apply flex gap-2;
}

.reward_row__token__select__wrapper {
    @apply w-2/5;
}

.reward_row__token__amount__input__wrapper {
    @apply w-3/5;
}

.reward_row__remove__icon {
    @apply w-10 h-10 hover:cursor-pointer;
}

.reward_row__remove__icon_hidden {
    @apply hidden;
}

.reward_row__token__amount__input {
    @apply text-right;
}

.reward_row__input__selected {
    @apply flex
        gap-2
        items-center
        h-[60px]
        p-4
        border
        rounded-xxl
        border-transparent
        bg-gray-100
        hover:cursor-pointer;
}

.reward_row__amount__input__selected {
    @apply justify-between;
}
</style>
