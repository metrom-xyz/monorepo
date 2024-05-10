<script setup lang="ts">
import MuiTokenSelect from "@/ui/token-select/MuiTokenSelect.vue";
import type { RewardRowProps } from "./types";
import MuiNumberInput from "@/ui/MuiNumberInput.vue";
import { ref } from "vue";
import RemoveXIcon from "@/icons/RemoveXIcon.vue";
import { useAttrs } from "vue";
import type { TokenInfoWithBalance } from "../types";
import { watchEffect } from "vue";
import { getRewardPlusFeeAmount } from "@/utils/rewards";
import { watch } from "vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { formatUnits } from "viem";
import { formatDecimals } from "sdk";
import { useAccount } from "vevm";
import { computed } from "vue";
import MuiPopover from "@/ui/popover/MuiPopover.vue";
import { onUnmounted } from "vue";

const props = defineProps<RewardRowProps>();
const emits = defineEmits<{
    insufficientBalance: [address: string, value: boolean];
    searchQueryChange: [query?: string];
}>();
const tokenModel = defineModel<TokenInfoWithBalance>("token");
const amountModel = defineModel<number>("amount");

const account = useAccount();
const attrs = useAttrs();

const open = ref<boolean>();
const insufficientBalancePopover = ref(false);
const tokenError = ref(false);
const amountError = ref(false);
const rewardWithFees = ref<{
    symbol: string;
    amount: string;
    balance: string;
    insufficient: boolean;
}>();

// keep the reactivity on the tokens to react when the balances
// are fetched after the reward has been picked
const computedTokens = computed(() => props.tokens);

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
            tokenModel.value.balance === undefined ||
            tokenModel.value.balance === null
        )
            return;

        const rewardPlusFee = getRewardPlusFeeAmount(
            tokenModel.value,
            amountModel.value,
            props.globalFee,
        );

        rewardWithFees.value = {
            symbol: tokenModel.value.symbol,
            amount: formatDecimals({
                number: formatUnits(rewardPlusFee, tokenModel.value.decimals),
                decimalsAmount: 3,
            }),
            balance: formatDecimals({
                number: formatUnits(
                    tokenModel.value.balance,
                    tokenModel.value.decimals,
                ),
                decimalsAmount: 3,
            }),
            insufficient: rewardPlusFee > tokenModel.value.balance,
        };
    },
    { immediate: false },
);

watch([amountModel, rewardWithFees], () => {
    amountError.value =
        !amountModel.value || !!rewardWithFees.value?.insufficient;
});

watchEffect(() => {
    if (rewardWithFees.value === undefined || !tokenModel.value) return;
    if (rewardWithFees.value.insufficient)
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
                <MuiTokenSelect
                    v-model="tokenModel"
                    :tokens="$props.tokens"
                    :open="open"
                    :error="tokenError"
                    :loading="$props.loading"
                    :messages="{
                        inputPlaceholder: $t(
                            'campaign.rewards.select.placeholder',
                        ),
                        search: {
                            inputLabel: $t(
                                'campaign.rewards.select.search.inputLabel',
                            ),
                            inputPlaceholder: $t(
                                'campaign.rewards.select.search.inputPlaceholder',
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
                <MuiNumberInput
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
        <div
            v-if="rewardWithFees && rewardWithFees.insufficient"
            class="reward_row__insufficient__balance__warning"
        >
            <MuiPopover
                :open="insufficientBalancePopover"
                :placement="'top-start'"
            >
                <MuiTypography
                    @mouseenter="insufficientBalancePopover = true"
                    @mouseleave="insufficientBalancePopover = false"
                    class="reward_row__insufficient__balance__label"
                >
                    {{ $t("campaign.rewards.insufficientBalance.label") }}
                </MuiTypography>
                <template #popover>
                    <div
                        class="reward_row__insufficient__balance__warning__popover"
                    >
                        <MuiTypography>
                            {{
                                $t(
                                    "campaign.rewards.insufficientBalance.required",
                                    {
                                        amount: rewardWithFees.amount,
                                        symbol: rewardWithFees.symbol,
                                    },
                                )
                            }}
                        </MuiTypography>
                        <MuiTypography>
                            {{
                                $t(
                                    "campaign.rewards.insufficientBalance.balance",
                                    {
                                        balance: rewardWithFees.balance,
                                        symbol: rewardWithFees.symbol,
                                    },
                                )
                            }}
                        </MuiTypography>
                    </div>
                </template>
            </MuiPopover>
        </div>
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
        border-2
        rounded-xxl
        border-transparent
        bg-gray-100
        hover:cursor-pointer;
}

.reward_row__amount__input__selected {
    @apply justify-between;
}

.reward_row__insufficient__balance__warning {
    @apply bg-yellow py-1 px-2 rounded-lg w-fit;
}

.reward_row__insufficient__balance__label {
    @apply hover:cursor-pointer;
}

.reward_row__insufficient__balance__warning__popover {
    @apply flex flex-col rounded-lg bg-yellow gap-2 p-3;
}
</style>
