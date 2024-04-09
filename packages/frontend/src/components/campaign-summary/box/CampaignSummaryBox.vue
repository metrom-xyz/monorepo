<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { CampaignSummaryBox } from "./types";

defineProps<CampaignSummaryBox>();
</script>
<template>
    <div class="campaign_summary_box__root">
        <MuiTypography lg class="campaign_summary_box__title">
            {{ $props.title }}
        </MuiTypography>
        <slot></slot>
    </div>
</template>
<style>
.campaign_summary_box__root {
    @apply flex flex-col gap-3;
}

.campaign_summary_box__title {
    @apply flex-1;
}
</style>
