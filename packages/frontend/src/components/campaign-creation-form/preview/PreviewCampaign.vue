<script setup lang="ts">
import { ref } from "vue";
import type { PreviewCampaignProps } from "./types";
import { useAccount, useConnect } from "vevm";
import type { FinalizedState } from "@/types";
import { injected } from "@wagmi/core";
import SubmitButton from "../../submit-button/SubmitButton.vue";
import WalletIcon from "@/icons/WalletIcon.vue";
import LineArrowRightIcon from "@/icons/LineArrowRightIcon.vue";

const props = defineProps<PreviewCampaignProps>();
const emits = defineEmits<{ validated: [state: FinalizedState] }>();

const account = useAccount();
const { connect } = useConnect();

function handleConnectOnClick() {
    connect({ connector: injected() });
}

const validatedState = ref<FinalizedState | undefined>();

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
    emits("validated", validatedState.value);
}
</script>
<template>
    <div class="deploy_campaign__root">
        <SubmitButton
            v-if="!account.isConnected"
            variant="submit"
            :icon="WalletIcon"
            @click="handleConnectOnClick"
        >
            {{ $t("campaign.confirm.connectWallet") }}
        </SubmitButton>
        <SubmitButton
            v-else-if="!$props.validated || !validatedState"
            variant="submit"
            :disabled="$props.disabled"
            :icon="LineArrowRightIcon"
            @click="handleConfirmOnClick"
        >
            {{ $t("campaign.confirm.preview") }}
        </SubmitButton>
    </div>
</template>
<style>
.deploy_campaign__root {
    @apply w-full flex flex-col-reverse items-center gap-4 relative;
}
</style>
