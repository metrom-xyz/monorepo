<script setup lang="ts">
import { useAccount, useReadContract, useReadContracts } from "vevm";
import { ref } from "vue";
import type { ApproveRewardsProps } from "./types";
import type { Reward } from "@/types";
import { computed } from "vue";
import { erc20Abi, type Address, parseUnits } from "viem";
import { watchEffect } from "vue";
import ApproveReward from "../approve-reward/ApproveReward.vue";
import metromAbi from "@/abis/metrom";
import SubmitButton from "../../submit-button/SubmitButton.vue";

const props = defineProps<ApproveRewardsProps>();
const emits = defineEmits(["allApproved"]);

const account = useAccount();

const rewardsToApprove = ref<Required<Reward[]>>(
    (props.rewards as Required<Reward[]>) || [],
);
const allRewardsApproved = ref(false);
const approvingRewardIndex = ref(0);

const approvingReward = computed(
    () =>
        rewardsToApprove.value[approvingRewardIndex.value] as Required<Reward>,
);

const { data: globalFee, loading: loadingGlobalFee } = useReadContract({
    address: props.metrom.address,
    abi: metromAbi,
    functionName: "globalFee",
});

const { data: allowances, loading: loadingAllowances } = useReadContracts(
    computed(() => ({
        contracts:
            (account.value.isConnected &&
                account.value.address &&
                props.rewards.map((reward) => {
                    return {
                        address: reward.token?.address as Address,
                        abi: erc20Abi,
                        functionName: "allowance",
                        args: [account.value.address, props.metrom.address],
                    };
                })) ||
            [],
    })),
);

function handleApproveRewardOnClick() {
    const updatedIndex = approvingRewardIndex.value + 1;
    if (!rewardsToApprove.value[updatedIndex]) {
        emits("allApproved");
        allRewardsApproved.value = true;
    } else approvingRewardIndex.value = updatedIndex;
}

watchEffect(() => {
    if (
        !allowances.value ||
        !props.rewards ||
        allowances.value.length !== props.rewards.length
    )
        return;

    const newToApprove = [];
    for (let i = 0; i < props.rewards.length; i++) {
        const reward = props.rewards[i] as Required<Reward>;
        if (
            allowances.value[i]?.result === null ||
            allowances.value[i]?.result === undefined ||
            !reward.amount
        )
            return;
        if (
            (allowances.value[i].result as bigint) >=
            parseUnits(reward.amount.toString(), reward.token.decimals)
        )
            continue;
        newToApprove.push(reward);
    }

    if (newToApprove.length === 0) {
        allRewardsApproved.value = true;
        return;
    }

    rewardsToApprove.value = newToApprove;
});
</script>
<template>
    <SubmitButton
        v-if="loadingAllowances || loadingGlobalFee || !globalFee"
        :loading="loadingAllowances || loadingGlobalFee || !globalFee"
        disabled
        :onClick="() => {}"
    />
    <ApproveReward
        v-else
        :metrom="$props.metrom"
        :reward="approvingReward"
        :globalFee="globalFee"
        :index="approvingRewardIndex"
        :total="rewardsToApprove.length"
        :loading="loadingAllowances || loadingGlobalFee"
        :onApprove="handleApproveRewardOnClick"
    />
</template>
<style></style>