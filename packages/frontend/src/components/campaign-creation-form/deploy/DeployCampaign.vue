<script setup lang="ts">
import { ref } from "vue";
import type { DeployCampaignProps } from "./types";
import ApproveRewards from "./approve-rewards/ApproveRewards.vue";
import { computed } from "vue";
import { useAccount, useConnect } from "vevm";
import type { FinalizedState } from "@/types";
import { injected } from "@wagmi/core";
import DeployButton from "./deploy-button/DeployButton.vue";
import SubmitButton from "../submit-button/SubmitButton.vue";
import WalletIcon from "@/icons/WalletIcon.vue";
import { MetButton, MetTypography } from "@metrom-xyz/ui";
import { CHAIN_DATA } from "@/commons";

const props = defineProps<DeployCampaignProps>();
const emits = defineEmits(["validated", "edited"]);

const account = useAccount();
const { connect } = useConnect();

function handleConnectOnClick() {
    connect({ connector: injected() });
}

const allRewardsApproved = ref(false);
const validatedState = ref<FinalizedState | undefined>();
const deployed = ref(false);

const metrom = computed(() => {
    if (!account.value.chainId) return;
    return CHAIN_DATA[account.value.chainId].contract;
});

function handleConfirmOnClick() {
    const { network, amm, pool, range, rewards, restrictions } = props.state;
    if (!amm || !pool || !range || rewards.length === 0) return;

    const { from, to } = range;
    if (!from || !to) return;

    const validRewards = rewards.filter(
        (reward) => reward.amount && reward.token,
    ) as FinalizedState["rewards"];

    if (validRewards.length !== rewards.length) return;

    validatedState.value = {
        amm,
        network,
        pool,
        range: { from, to },
        rewards: validRewards,
        ...(restrictions
            ? { specification: { [restrictions.type]: restrictions.list } }
            : {}),
    };
    emits("validated");
}

function handleEditOnClick() {
    validatedState.value = undefined;
    allRewardsApproved.value = false;
    emits("edited");
}
</script>
<template>
    <div class="deploy_campaign__root">
        <MetButton
            v-if="$props.validated && !deployed"
            sm
            @click="handleEditOnClick"
        >
            <MetTypography>{{ $t("campaign.deploy.edit") }}</MetTypography>
        </MetButton>
        <SubmitButton
            v-if="!account.isConnected"
            @click="handleConnectOnClick"
            :icon="WalletIcon"
        >
            {{ $t("campaign.deploy.connectWallet") }}
        </SubmitButton>
        <SubmitButton
            v-else-if="!$props.validated || !validatedState"
            :disabled="$props.disabled"
            @click="handleConfirmOnClick"
        >
            {{ $t("campaign.deploy.confirm") }}
        </SubmitButton>
        <ApproveRewards
            v-else-if="!allRewardsApproved && metrom"
            :disabled="$props.disabled"
            :rewards="validatedState.rewards"
            :metrom="metrom"
            @allApproved="allRewardsApproved = true"
        />
        <DeployButton
            v-else-if="metrom"
            :disabled="$props.disabled"
            :metrom="metrom"
            :state="validatedState"
            @deployed="deployed = true"
        />
    </div>
</template>
<style>
.deploy_campaign__root {
    @apply w-full flex flex-col-reverse items-center gap-4 relative;
}
</style>
