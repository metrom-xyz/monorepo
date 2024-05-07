<script setup lang="ts">
import { ref } from "vue";
import type { DeployCampaignProps } from "./types";
import ApproveRewards from "./approve-rewards/ApproveRewards.vue";
import { computed } from "vue";
import { useAccount, useConnect } from "vevm";
import { ADDRESS } from "@metrom-xyz/contracts";
import type { FinalizedState } from "@/types";
import { injected } from "@wagmi/core";
import DeployButton from "./deploy-button/DeployButton.vue";
import SubmitButton from "../submit-button/SubmitButton.vue";
import WalletIcon from "@/icons/WalletIcon.vue";
import MuiButton from "@/ui/button/MuiButton.vue";

const props = defineProps<DeployCampaignProps>();
const emits = defineEmits(["validated", "edited"]);

const account = useAccount();
const { connect } = useConnect();

function handleConnectOnClick() {
    connect({ connector: injected() });
}

const allRewardsApproved = ref(false);
const validatedState = ref<FinalizedState | undefined>();

const metrom = computed(() => {
    if (!account.value.chainId) return;
    return ADDRESS[account.value.chainId];
});

function handleConfirmOnClick() {
    const { network, amm, pair, range, rewards } = props.state;
    if (!amm || !pair || !range || rewards.length === 0) return;

    const { from, to } = range;
    if (!from || !to) return;

    const validRewards = rewards.filter(
        (reward) => reward.amount && reward.token,
    ) as FinalizedState["rewards"];

    if (validRewards.length !== rewards.length) return;

    // TODO: add minimun and maximum campaign duration validation

    validatedState.value = {
        amm,
        network,
        pair,
        range: { from, to },
        rewards: validRewards,
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
        <MuiButton v-if="$props.validated" sm @click="handleEditOnClick">
            {{ $t("campaign.deploy.edit") }}
        </MuiButton>
        <SubmitButton
            v-if="!$props.validated || !validatedState"
            @click="handleConfirmOnClick"
        >
            {{ $t("campaign.deploy.confirm") }}
        </SubmitButton>
        <SubmitButton
            v-else-if="!account.isConnected"
            @click="handleConnectOnClick"
            :icon="WalletIcon"
        >
            {{ $t("campaign.deploy.connectWallet") }}
        </SubmitButton>
        <ApproveRewards
            v-else-if="!allRewardsApproved && metrom"
            :rewards="validatedState.rewards"
            :metrom="metrom"
            @allApproved="allRewardsApproved = true"
        />
        <DeployButton
            v-else-if="metrom"
            :metrom="metrom"
            :state="validatedState"
        />
    </div>
</template>
<style>
.deploy_campaign__root {
    @apply w-full flex flex-col-reverse items-center gap-4;
}
</style>