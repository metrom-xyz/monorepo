<script setup lang="ts">
import {
    MetTokenSelect,
    MetNumberInput,
    MetTypography,
    MetWarningMessage,
    type TokenInfo,
} from "@metrom-xyz/ui";
import type { RewardRowProps } from "./types";
import { ref } from "vue";
import RemoveXIcon from "@/icons/RemoveXIcon.vue";
import { useAttrs } from "vue";
import { watchEffect } from "vue";
import { watch } from "vue";
import { formatUnits, parseUnits } from "viem";
import { formatDecimals } from "sdk";
import { useAccount } from "vevm";
import { computed } from "vue";
import { onUnmounted } from "vue";

const props = defineProps<RewardRowProps>();
const emits = defineEmits<{
    insufficientBalance: [address: string, value: boolean];
    rewardRateTooLow: [address: string, value: boolean];
    searchQueryChange: [query?: string];
}>();
const tokenModel = defineModel<TokenInfo>("token");
const amountModel = defineModel<number>("amount");

const account = useAccount();
const attrs = useAttrs();

const open = ref<boolean>();
const tokenError = ref(false);
const amountError = ref(false);
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

    return (
        (amountModel.value * 3_600) / campaignDuration <
        Number(
            formatUnits(
                tokenModel.value.minimumRate,
                tokenModel.value.decimals,
            ),
        )
    );
});

// emit the
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
                number: amountModel.value.toString(),
            }),
            balance: formatDecimals({
                number: formatUnits(
                    tokenModel.value.balance,
                    tokenModel.value.decimals,
                ),
            }),
            insufficient:
                parseUnits(
                    amountModel.value.toString(),
                    tokenModel.value.decimals,
                ) > tokenModel.value.balance,
        };
    },
    { immediate: false },
);

watch([amountModel, reward], () => {
    amountError.value = !amountModel.value || !!reward.value?.insufficient;
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
                    :error="tokenError"
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
                    :placeholder="$t('campaign.rewards.amount')"
                    class="reward_row__token__amount__input"
                    v-model="amountModel"
                    :error="amountError"
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
        <MetWarningMessage v-if="reward && reward.insufficient">
            <MetTypography>
                {{ $t("campaign.rewards.insufficientBalance.label") }}
            </MetTypography>
            <template #popover>
                <MetTypography>
                    {{
                        $t("campaign.rewards.insufficientBalance.info", {
                            symbol: reward.symbol,
                            balance: reward.balance,
                        })
                    }}
                </MetTypography>
            </template>
        </MetWarningMessage>
        <MetWarningMessage v-if="rewardRateTooLow && tokenModel?.minimumRate">
            <MetTypography>
                {{ $t("campaign.rewards.lowRate.label") }}
            </MetTypography>
            <template #popover>
                <MetTypography>
                    {{
                        $t("campaign.rewards.lowRate.info", {
                            symbol: tokenModel.symbol.toUpperCase(),
                            minimumRewardAmount: formatDecimals({
                                number: minimumRewardAmount.toString(),
                            }),
                            minimumRewardRate: formatDecimals({
                                number: formatUnits(
                                    tokenModel.minimumRate,
                                    tokenModel.decimals,
                                ),
                            }),
                        })
                    }}
                </MetTypography>
            </template>
        </MetWarningMessage>
    </div>
</template>
<style>
.reward_row__root {
    @apply flex flex-col gap-2 items-end;
}

.reward_row__wrapper {
    @apply flex gap-2 items-center;
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
