<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { ref } from "vue";
import type { CampaignState } from "./types";
import { watchEffect } from "vue";
import CampaignCreationForm from "@/components/campaign-creation-form/CampaignCreationForm.vue";

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
        <template v-if="preview"
            ><MuiTypography h3>
                {{ $t("campaign.summary.title") }}
            </MuiTypography></template
        >
        <template v-else>
            <MuiTypography h3>{{ $t("campaign.create.title") }}</MuiTypography>
            <CampaignCreationForm
                :state="campaignState"
                :onPreviewClick="() => (preview = true)"
            />
        </template>
    </div>
</template>
<style>
.create_campaign__root {
    @apply w-full flex flex-col gap-9 items-center min-w-96 max-w-96;
}
</style>
