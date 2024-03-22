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

const activeStep = ref(1);
const campaignState = ref<CampaignState>();

function handleCampaignStateOnUpdate(state: CampaignState) {
    campaignState.value = state;
}
</script>
<template>
    <div class="create_campaign__root">
        <MuiTypography h3>{{ $t("campaign.title") }}</MuiTypography>
        <MuiStepper>
            <MuiStep
                :step="1"
                :title="$t('campaign.amm.title')"
                active
                :completed="activeStep > 1"
                :icon="DexIcon"
            >
                <AmmPicker
                    :state="campaignState"
                    @updateState="handleCampaignStateOnUpdate"
                />
            </MuiStep>
            <MuiStep
                :step="2"
                :title="$t('campaign.pair.title')"
                :active="activeStep === 2"
                :completed="activeStep > 2"
                :icon="PairIcon"
            >
                Step 2
            </MuiStep>
            <MuiStep
                :step="3"
                :title="$t('campaign.rewards.title')"
                :active="activeStep === 3"
                :completed="activeStep > 3"
                :icon="CupIcon"
            >
                Step 3
            </MuiStep>
        </MuiStepper>
    </div>
</template>
<style>
.create_campaign__root {
    @apply w-full flex flex-col gap-9 items-center min-w-96;
}
</style>
