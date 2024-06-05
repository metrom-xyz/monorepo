<script setup lang="ts">
import type { RewardsPickerTypes, TokenInfoWithBalance } from "./types";
import { watchEffect } from "vue";
import PlusCircleIcon from "@/icons/PlusCircleIcon.vue";
import RewardRow from "./reward-row/RewardRow.vue";
import { useAccount, useReadContract, useReadContracts } from "vevm";
import { erc20Abi, type Address } from "viem";
import { computed } from "vue";
import { ref } from "vue";
import { ADDRESS } from "@metrom-xyz/contracts";
import metromAbi from "@/abis/metrom";
import { useWhitelistedRewardTokens } from "@/composables/useWhitelistedRewardTokens";
import { CHAIN_DATA } from "@/commons";

const props = defineProps<RewardsPickerTypes>();
const emits = defineEmits<{
    addReward: [];
    removeReward: [address: number];
    complete: [];
    error: [boolean];
}>();

const account = useAccount();

const tokenSearchQuery = ref();
const { loading: loadingWhitelistedTokens, whitelistedTokens } =
    useWhitelistedRewardTokens(
        computed(() => ({
            client: CHAIN_DATA[props.state.network].metromApiClient,
        })),
    );

const rewardsWithInsufficientBalance = ref<string[]>([]);
const rewardsWithRateTooLow = ref<string[]>([]);

const metrom = computed(() => {
    if (!account.value.chainId) return;
    return ADDRESS[account.value.chainId];
});

const { data: globalFee, loading: loadingGlobalFee } = useReadContract(
    computed(() => {
        return {
            address: metrom.value?.address as Address,
            abi: metromAbi,
            functionName: "fee",
        };
    }),
);

const { data: rawBalances, loading: loadingBalances } = useReadContracts(
    computed(() => ({
        contracts:
            (account.value.isConnected &&
                account.value.address &&
                whitelistedTokens.value &&
                whitelistedTokens.value.map((token) => {
                    return {
                        abi: erc20Abi,
                        address: token.address as Address,
                        functionName: "balanceOf",
                        args: [account.value.address],
                    };
                })) ||
            [],
        allowFailure: true,
    })),
);

const tokensWithBalance = computed(() => {
    if (!whitelistedTokens.value) return [];

    const tokensInChainWithBalance = whitelistedTokens.value.reduce(
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

    const tokensWithBalance = whitelistedTokens.value.map((token) => {
        const tokenWithBalance =
            tokensInChainWithBalance[
                `${token.address.toLowerCase()}-${token.chainId}`
            ];
        return tokenWithBalance || token;
    });

    return tokensWithBalance;
});

watchEffect(() => {
    emits(
        "error",
        props.completed &&
            (rewardsWithInsufficientBalance.value.length > 0 ||
                rewardsWithRateTooLow.value.length > 0 ||
                props.state.rewards.filter(
                    ({ amount, token }) => !token || !amount,
                ).length > 0),
    );

    if (
        props.completed ||
        props.state.rewards.filter(({ amount, token }) => !!token && !!amount)
            .length === 0
    )
        return;
    emits("complete");
});

function handleRewardOnTokenRemove(index: number) {
    emits("removeReward", index);
}

function handleRewardOnInsufficientBalance(
    address: string,
    insufficientBalance: boolean,
) {
    const existing = rewardsWithInsufficientBalance.value.find(
        (reward) => reward === address,
    );

    if (insufficientBalance) {
        if (!existing) rewardsWithInsufficientBalance.value.push(address);
    } else {
        if (existing)
            rewardsWithInsufficientBalance.value =
                rewardsWithInsufficientBalance.value.filter(
                    (reward) => reward !== address,
                );
    }
}

function handleRewardOnRateTooLow(address: string, rateTooLow: boolean) {
    const existing = rewardsWithRateTooLow.value.find(
        (reward) => reward === address,
    );

    if (rateTooLow) {
        if (!existing) rewardsWithRateTooLow.value.push(address);
    } else {
        if (existing)
            rewardsWithRateTooLow.value = rewardsWithRateTooLow.value.filter(
                (reward) => reward !== address,
            );
    }
}
</script>
<template>
    <div class="rewards_picker__root">
        <div class="rewards_picker__rewards_wrapper">
            <template
                v-for="(reward, index) in $props.state.rewards"
                :key="reward.id"
            >
                <RewardRow
                    :index="index"
                    :tokens="tokensWithBalance"
                    :globalFee="globalFee"
                    :loading="
                        loadingGlobalFee ||
                        loadingBalances ||
                        loadingWhitelistedTokens
                    "
                    :state="$props.state"
                    :rewards="$props.state.rewards"
                    v-model:token="$props.state.rewards[index].token"
                    v-model:amount="$props.state.rewards[index].amount"
                    :onRemove="handleRewardOnTokenRemove"
                    @searchQueryChange="tokenSearchQuery = $event"
                    @insufficientBalance="handleRewardOnInsufficientBalance"
                    @rewardRateTooLow="handleRewardOnRateTooLow"
                />
            </template>
        </div>
        <div
            class="rewards_picker__footer rewards_picker__action"
            @click="emits('addReward')"
            v-if="$props.state.rewards.length < 5"
        >
            <PlusCircleIcon />
            {{ $t("campaign.rewards.addReward") }}
        </div>
        <div v-else class="rewards_picker__footer rewards_picker__max_rewards">
            {{ $t("campaign.rewards.maxRewards") }}
        </div>
    </div>
</template>
<style>
.rewards_picker__root {
    @apply flex flex-col;
}

.rewards_picker__rewards_wrapper {
    @apply flex flex-col gap-2 p-3;
}

.rewards_picker__reward_wrapper {
    @apply flex gap-2;
}

.rewards_picker__amount_input {
    @apply text-right;
}

.rewards_picker__footer {
    @apply flex
        bg-gray-100
        border-t
        border-dashed
        border-gray-400
        py-5
        px-9
        rounded-b-[30px];
}

.rewards_picker__action {
    @apply flex gap-3 cursor-pointer;
}

.rewards_picker__max_rewards {
    @apply flex justify-center items-center;
}
</style>
