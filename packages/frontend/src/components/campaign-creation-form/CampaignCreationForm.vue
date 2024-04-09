<script setup lang="ts">
import CalendarIcon from "@/icons/CalendarIcon.vue";
import CupIcon from "@/icons/CupIcon.vue";
import DexIcon from "@/icons/DexIcon.vue";
import PairIcon from "@/icons/PairIcon.vue";
import SendIcon from "@/icons/SendIcon.vue";
import MuiCard from "@/ui/MuiCard.vue";
import MuiStepper from "@/ui/stepper/MuiStepper.vue";
import MuiStep from "@/ui/stepper/step/MuiStep.vue";
import PreviewDeployButton from "./preview-deploy-button/PreviewDeployButton.vue";
import DatePicker from "./date/DatePicker.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import RewardsPicker from "./rewards/RewardsPicker.vue";
import PairPicker from "./pair/PairPicker.vue";
import AmmPicker from "./amm/AmmPicker.vue";
import type { CampaignCreationFormProps } from "./types";
import { ref } from "vue";

defineProps<CampaignCreationFormProps>();
const emit = defineEmits<{
    addReward: [];
    removeReward: [index: number];
}>();

const stepCursor = ref(1);

function handleStepOnComplete() {
    stepCursor.value++;
}
</script>
<template>
    <div class="campaign_creation_form__root">
        <MuiStepper>
            <MuiStep
                :step="1"
                :title="$t('campaign.amm.title')"
                active
                :completed="stepCursor > 1"
                :icon="DexIcon"
            >
                <MuiCard>
                    <template #title>
                        <MuiTypography medium lg>
                            {{ $t("campaign.amm.title") }}
                        </MuiTypography>
                    </template>
                    <template #content>
                        <div class="mui_step__content">
                            <AmmPicker
                                :state="$props.state"
                                :completed="stepCursor > 1"
                                @complete="handleStepOnComplete"
                            />
                        </div>
                    </template>
                </MuiCard>
            </MuiStep>
            <MuiStep
                :step="2"
                :title="$t('campaign.pair.title')"
                :active="stepCursor === 2"
                :completed="stepCursor > 2"
                :icon="PairIcon"
            >
                <MuiCard>
                    <template #title>
                        <MuiTypography medium lg>
                            {{ $t("campaign.pair.title") }}
                        </MuiTypography>
                    </template>
                    <template #content>
                        <PairPicker
                            :state="$props.state"
                            :completed="stepCursor > 2"
                            @complete="handleStepOnComplete"
                        />
                    </template>
                </MuiCard>
            </MuiStep>
            <MuiStep
                :step="3"
                :title="$t('campaign.rewards.title')"
                :active="stepCursor === 3"
                :completed="stepCursor > 3"
                :icon="CupIcon"
            >
                <MuiCard>
                    <template #title>
                        <MuiTypography medium lg>
                            {{ $t("campaign.rewards.title") }}
                        </MuiTypography>
                    </template>
                    <template #content>
                        <RewardsPicker
                            :state="$props.state"
                            :completed="stepCursor > 3"
                            @addReward="emit('addReward')"
                            @removeReward="emit('removeReward', $event)"
                            @complete="handleStepOnComplete"
                        />
                    </template>
                </MuiCard>
            </MuiStep>
            <MuiStep
                :step="4"
                :title="$t('campaign.range.title')"
                :active="stepCursor === 4"
                :completed="stepCursor > 4"
                :icon="CalendarIcon"
            >
                <MuiCard>
                    <template #title>
                        <MuiTypography medium lg>
                            {{ $t("campaign.range.title") }}
                        </MuiTypography>
                    </template>
                    <template #content>
                        <DatePicker
                            :state="$props.state"
                            :completed="stepCursor > 4"
                            @complete="handleStepOnComplete"
                        />
                    </template>
                </MuiCard>
            </MuiStep>
            <MuiStep
                :step="5"
                :title="$t('campaign.deploy.title')"
                :active="stepCursor === 5"
                :completed="stepCursor > 5"
                :icon="SendIcon"
            >
                <PreviewDeployButton
                    variant="preview"
                    :onClick="$props.onPreviewClick"
                />
            </MuiStep>
        </MuiStepper>
    </div>
</template>
<style>
.campaign_creation_form__root {
    @apply w-full;
}
</style>
