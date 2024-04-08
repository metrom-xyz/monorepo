<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { ref } from "vue";
import type { CampaignState } from "./types";
import { watchEffect } from "vue";
import CampaignCreationForm from "@/components/campaign-creation-form/CampaignCreationForm.vue";
import CampaignSummary from "@/components/campaign-summary/CampaignSummary.vue";

const preview = ref(false);
const campaignState = ref<CampaignState>({
    rewards: [{}],
});

watchEffect(() => {
    console.log("campaign", JSON.stringify(campaignState.value, null, 4));
});
</script>
<template>
    <div class="create_campaign__root">
        <div v-if="preview" class="create_campaign__summary__container">
            <MuiTypography h3>
                {{ $t("campaign.summary.title") }}
            </MuiTypography>
            <CampaignSummary :state="campaignState" />
        </div>
        <div v-else class="create_campaign__form__container">
            <MuiTypography h3>{{ $t("campaign.create.title") }}</MuiTypography>
            <CampaignCreationForm
                :state="campaignState"
                :onPreviewClick="() => (preview = true)"
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
