<script setup lang="ts">
import type { RewardsPickerTypes } from "./types";
import { watchEffect } from "vue";
import type { TokenInfo } from "@uniswap/token-lists";
import PlusCircleIcon from "@/icons/PlusCircleIcon.vue";
import RewardRow from "./reward-row/RewardRow.vue";

// TODO: fetch
const TOKENS: TokenInfo[] = [
    {
        chainId: 0,
        address: "0x27cd006548df7c8c8e9fdc4a67fa05c2e3ca5cf9",
        name: "test3",
        symbol: "tst3",
        decimals: 18,
    },
    {
        chainId: 1,
        address: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
        name: "Celo native asset",
        symbol: "CELO",
        decimals: 18,
    },
    {
        chainId: 0,
        address: "0x92724824f7fa4ee45142c29cbd0c3d4f6b609546",
        name: "TIMES Coin",
        symbol: "TIMES",
        decimals: 18,
    },
    {
        chainId: 0,
        address: "0xa6920dd986896d5433b4f388fcb705947a6af835",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 18,
    },
    {
        chainId: 0,
        address: "0xd8e7bbf912cc93db7383b8320b233cf6ee7d6757",
        name: "cryplo",
        symbol: "CLO",
        decimals: 9,
    },
];

const props = defineProps<RewardsPickerTypes>();
const emit = defineEmits<{
    addReward: [];
    removeReward: [address: number];
    complete: [];
}>();

watchEffect(() => {
    if (
        props.completed ||
        props.state.rewards.filter(({ amount, token }) => !!token && !!amount)
            .length === 0
    )
        return;
    emit("complete");
});

function handleRewardOnTokenRemove(index: number) {
    emit("removeReward", index);
}
</script>
<template>
    <div class="rewards_picker__root">
        <div class="rewards_picker__rewards_wrapper">
            <RewardRow
                :key="index"
                :index="index"
                v-for="(_, index) in $props.state.rewards"
                :tokens="TOKENS"
                :rewards="$props.state.rewards"
                v-model:token="$props.state.rewards[index].token"
                v-model:amount="$props.state.rewards[index].amount"
                :onRemove="handleRewardOnTokenRemove"
            />
        </div>
        <div
            class="rewards_picker__footer rewards_picker__action"
            @click="emit('addReward')"
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
