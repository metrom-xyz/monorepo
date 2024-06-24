<script setup lang="ts">
import CalendarIcon from "@/icons/CalendarIcon.vue";
import CupIcon from "@/icons/CupIcon.vue";
import DexIcon from "@/icons/DexIcon.vue";
import PoolIcon from "@/icons/PoolIcon.vue";
import SendIcon from "@/icons/SendIcon.vue";
import { MetCard, MetStepper, MetStep, MetTypography } from "@metrom-xyz/ui";
import RewardsPicker from "./rewards/RewardsPicker.vue";
import PoolPicker from "./pool/PoolPicker.vue";
import AmmPicker from "./amm/AmmPicker.vue";
import type { CampaignCreationFormProps } from "./types";
import { computed, ref } from "vue";
import { watch } from "vue";
import DeployCampaign from "./deploy/DeployCampaign.vue";
import DatePicker from "./date/DatePicker.vue";
import AuthenticateUser from "../AuthenticateUser.vue";
import { useLogin } from "@/stores/auth";
import { storeToRefs } from "pinia";
import RestrictionsPicker from "./restrictions/RestrictionsPicker.vue";

const props = defineProps<CampaignCreationFormProps>();
const emits = defineEmits<{
    addReward: [];
    removeReward: [index: number];
    reset: [];
}>();

const stepCursor = ref(1);
const ammStepError = ref(false);
const rewardsStepError = ref(false);
const dateRangeStepError = ref(false);
const readonly = ref(false);

const { isJwtTokenValid: isJwtAuthTokenValid } = storeToRefs(useLogin());

const formError = computed(
    () =>
        ammStepError.value ||
        rewardsStepError.value ||
        dateRangeStepError.value,
);

const showLogin = computed(
    () =>
        !isJwtAuthTokenValid.value &&
        readonly.value &&
        props.state.restrictions,
);

function handleStepOnComplete() {
    stepCursor.value++;
}

function handleCampaignValidated() {
    readonly.value = true;
}

function handleCampaignEdited() {
    readonly.value = false;
}

// reset the whole state when the selected network changes
watch(
    () => props.state.network,
    (network, oldNetwork) => {
        if (network !== oldNetwork) {
            stepCursor.value = 1;
            emits("reset");
        }
    },
);

// reset the whole state when the selected amm changes
watch(
    () => props.state.amm,
    (amm, oldAmm) => {
        if (!!oldAmm && amm !== oldAmm) {
            stepCursor.value = 1;
            emits("reset");
        }
    },
);
</script>
<template>
    <div class="campaign_creation_form__root">
        <AuthenticateUser v-show="showLogin" />
        <MetStepper v-show="!showLogin">
            <MetStep
                active
                :step="1"
                :title="$t('campaign.amm.title')"
                :completed="stepCursor > 1"
                :error="ammStepError"
                :icon="DexIcon"
                :disabled="readonly"
            >
                <MetCard :disabled="readonly">
                    <template #title>
                        <MetTypography medium lg>
                            {{ $t("campaign.amm.title") }}
                        </MetTypography>
                    </template>
                    <template #content>
                        <AmmPicker
                            :state="$props.state"
                            :completed="stepCursor > 1"
                            @complete="handleStepOnComplete"
                            @error="ammStepError = $event"
                        />
                    </template>
                </MetCard>
            </MetStep>
            <MetStep
                :step="2"
                :title="$t('campaign.pool.title')"
                :active="stepCursor === 2"
                :completed="stepCursor > 2"
                :icon="PoolIcon"
                :disabled="readonly"
            >
                <MetCard :disabled="readonly">
                    <template #title>
                        <MetTypography medium lg>
                            {{ $t("campaign.pool.title") }}
                        </MetTypography>
                    </template>
                    <template #content>
                        <PoolPicker
                            :state="$props.state"
                            :completed="stepCursor > 2"
                            @complete="handleStepOnComplete"
                        />
                    </template>
                </MetCard>
            </MetStep>
            <MetStep
                :step="3"
                :title="$t('campaign.rewards.title')"
                :active="stepCursor === 3"
                :completed="stepCursor > 3"
                :error="rewardsStepError"
                :icon="CupIcon"
                :disabled="readonly"
            >
                <MetCard :disabled="readonly">
                    <template #title>
                        <div class="campaign_creation_form__restrictions">
                            <MetTypography medium lg>
                                {{ $t("campaign.rewards.title") }}
                            </MetTypography>
                            <RestrictionsPicker
                                v-model="$props.state.restrictions"
                            />
                        </div>
                    </template>
                    <template #content>
                        <RewardsPicker
                            :state="$props.state"
                            :completed="stepCursor > 3"
                            @addReward="emits('addReward')"
                            @removeReward="emits('removeReward', $event)"
                            @complete="handleStepOnComplete"
                            @error="rewardsStepError = $event"
                        />
                    </template>
                </MetCard>
            </MetStep>
            <MetStep
                :step="4"
                :title="$t('campaign.range.title')"
                :active="stepCursor === 4"
                :completed="stepCursor > 4"
                :error="dateRangeStepError"
                :icon="CalendarIcon"
                :disabled="readonly"
            >
                <MetCard :disabled="readonly">
                    <template #title>
                        <MetTypography medium lg>
                            {{ $t("campaign.range.title") }}
                        </MetTypography>
                    </template>
                    <template #content>
                        <DatePicker
                            :state="$props.state"
                            :completed="stepCursor > 4"
                            @complete="handleStepOnComplete"
                            @error="dateRangeStepError = $event"
                        />
                    </template>
                </MetCard>
            </MetStep>
            <MetStep
                :step="5"
                :title="$t('campaign.deploy.title')"
                :active="stepCursor === 5"
                :completed="stepCursor > 5"
                :icon="SendIcon"
                :disabled="readonly"
            >
                <DeployCampaign
                    :state="$props.state"
                    :disabled="formError"
                    :validated="readonly"
                    @validated="handleCampaignValidated"
                    @edited="handleCampaignEdited"
                />
            </MetStep>
        </MetStepper>
    </div>
</template>
<style>
.campaign_creation_form__root {
    @apply w-full;
}

.campaign_creation_form__restrictions {
    @apply w-full flex justify-between items-center;
}
</style>
