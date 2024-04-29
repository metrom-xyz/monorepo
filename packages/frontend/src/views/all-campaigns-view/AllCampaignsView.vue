<script setup lang="ts">
import CampaignsTable from "@/components/campaigns-table/CampaignsTable.vue";
import type { AllCampaignsViewProps } from "./types";

defineProps<AllCampaignsViewProps>();
</script>
<template>
    <div class="all_campaigns__root">
        <CampaignsTable :selectedChain="$props.selectedChain" />
    </div>
</template>
<style>
.all_campaigns__root {
    @apply w-full;
}
</style>
