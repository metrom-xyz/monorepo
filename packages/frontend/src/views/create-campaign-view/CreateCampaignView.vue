<script setup lang="ts">
import AmmPicker from "@/components/campaign-creation/amm/AmmPicker.vue";
import MuiStepper from "@/ui/stepper/MuiStepper.vue";
import MuiStep from "@/ui/stepper/step/MuiStep.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { ref } from "vue";
import type { CampaignState } from "./types";
import DexIcon from "@/icons/DexIcon.vue";
import PairIcon from "@/icons/PairIcon.vue";
import CupIcon from "@/icons/CupIcon.vue";
import PairPicker from "@/components/campaign-creation/pair/PairPicker.vue";
import RewardsPicker from "@/components/campaign-creation/rewards/RewardsPicker.vue";
import { watchEffect } from "vue";
import CalendarIcon from "@/icons/CalendarIcon.vue";
import DatePicker from "@/components/campaign-creation/date/DatePicker.vue";

const stepCursor = ref(1);
const campaignState = ref<CampaignState>({
    rewards: [{}],
});

function handleCampaignStateOnUpdate(state: CampaignState) {
    campaignState.value = state;
}

function handleStepOnComplete() {
    stepCursor.value++;
}

watchEffect(() => {
    console.log("campaign", JSON.stringify(campaignState.value, null, 4));
});
</script>
<template>
    <div class="create_campaign__root">
        <MuiTypography h3>{{ $t("campaign.title") }}</MuiTypography>
        <MuiStepper>
            <MuiStep
                :step="1"
                :title="$t('campaign.amm.title')"
                active
                :completed="stepCursor > 1"
                :icon="DexIcon"
            >
                <AmmPicker
                    :state="campaignState"
                    :completed="stepCursor > 1"
                    @updateState="handleCampaignStateOnUpdate"
                    @complete="handleStepOnComplete"
                />
            </MuiStep>
            <MuiStep
                :step="2"
                :title="$t('campaign.pair.title')"
                :active="stepCursor === 2"
                :completed="stepCursor > 2"
                :icon="PairIcon"
            >
                <PairPicker
                    :state="campaignState"
                    :completed="stepCursor > 2"
                    @complete="handleStepOnComplete"
                />
            </MuiStep>
            <MuiStep
                :step="3"
                :title="$t('campaign.rewards.title')"
                :active="stepCursor === 3"
                :completed="stepCursor > 3"
                :icon="CupIcon"
            >
                <RewardsPicker
                    :state="campaignState"
                    :completed="stepCursor > 3"
                    @addReward="campaignState.rewards.push({})"
                    @complete="handleStepOnComplete"
                />
            </MuiStep>
            <MuiStep
                :step="4"
                :title="$t('campaign.range.title')"
                :active="stepCursor === 4"
                :completed="stepCursor > 4"
                :icon="CalendarIcon"
            >
                <DatePicker
                    :state="campaignState"
                    :completed="stepCursor > 4"
                    @complete="handleStepOnComplete"
                />
            </MuiStep>
        </MuiStepper>
    </div>
</template>
<style>
.create_campaign__root {
    @apply w-full flex flex-col gap-9 items-center min-w-96 max-w-96;
}
</style>
