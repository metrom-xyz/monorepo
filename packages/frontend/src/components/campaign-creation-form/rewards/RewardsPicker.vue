<script setup lang="ts">
import type { RewardsPickerTypes } from "./types";
import { watchEffect } from "vue";
import PlusCircleIcon from "@/icons/PlusCircleIcon.vue";
import RewardRow from "./reward-row/RewardRow.vue";

const props = defineProps<RewardsPickerTypes>();
const emits = defineEmits<{
    addReward: [];
    removeReward: [address: number];
    complete: [];
    error: [boolean];
}>();

watchEffect(() => {
    emits(
        "error",
        props.completed &&
            props.state.rewards.filter(({ amount, token }) => !token || !amount)
                .length > 0,
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
                    :rewards="$props.state.rewards"
                    v-model:token="$props.state.rewards[index].token"
                    v-model:amount="$props.state.rewards[index].amount"
                    :onRemove="handleRewardOnTokenRemove"
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
