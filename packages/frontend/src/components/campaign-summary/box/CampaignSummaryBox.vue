<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import type { CampaignSummaryBox } from "./types";

defineProps<CampaignSummaryBox>();
</script>
<template>
    <div class="campaign_summary_box__root">
        <MetTypography lg class="campaign_summary_box__title">
            {{ $props.title }}
        </MetTypography>
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
