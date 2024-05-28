<script setup lang="ts">
import { ref } from "vue";
import type { CreateCampaignViewProps } from "./types";
import CampaignCreationForm from "@/components/campaign-creation-form/CampaignCreationForm.vue";
import { v4 } from "uuid";
import { watchEffect } from "vue";
import type { CampaignState } from "@/types";
import AuthenticateAccount from "@/components/AuthenticateAccount.vue";
import { useAuth } from "@/stores/auth";

const props = defineProps<CreateCampaignViewProps>();

const auth = useAuth();

const preview = ref(false);
const campaignState = ref<CampaignState>({
    network: props.selectedChain,
    rewards: [{ id: v4() }],
});

function handleRewardOnRemove(index: number) {
    if (campaignState.value.rewards.length > 1) {
        campaignState.value.rewards = campaignState.value.rewards.filter(
            (_, i) => i !== index,
        );
    }
}

function handlePreviewOnClick() {
    preview.value = true;
    campaignState.value = {
        ...campaignState.value,
        rewards: campaignState.value.rewards.filter(
            (reward) => reward.amount && reward.token,
        ),
    };
}

function handleStateReset() {
    campaignState.value = {
        network: props.selectedChain,
        rewards: [{ id: v4() }],
    };
}

watchEffect(() => [(campaignState.value.network = props.selectedChain)]);
</script>
<template>
    <div class="create_campaign__root">
        <div class="create_campaign__form__container">
            <AuthenticateAccount v-if="!auth.isJwtAuthTokenValid" />
            <CampaignCreationForm
                v-else
                :state="campaignState"
                :onPreviewClick="handlePreviewOnClick"
                @addReward="campaignState.rewards.push({ id: v4() })"
                @removeReward="handleRewardOnRemove"
                @reset="handleStateReset"
            />
        </div>
    </div>
</template>
<style>
.create_campaign__root {
    @apply w-full;
}

.create_campaign__summary__container {
    @apply w-full flex flex-col gap-9 items-center;
}

.create_campaign__form__container {
    @apply flex flex-col gap-9 items-center min-w-96 max-w-96;
}
</style>
