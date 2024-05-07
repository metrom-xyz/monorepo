<script setup lang="ts">
import type { CampaignsTableExplorerProps } from "./types";
import { computed } from "vue";
import { getPairExplorerLink } from "@/utils/amm";
import ChartIcon from "@/icons/ChartIcon.vue";

const props = defineProps<CampaignsTableExplorerProps>();

const pairExplorerLink = computed(() => {
    return getPairExplorerLink(props.chainId, props.ammSlug, props.pair);
});
</script>
<template>
    <div class="campaigns_table_explorer__root">
        <a
            v-if="pairExplorerLink"
            :href="pairExplorerLink"
            target="_blank"
            rel="noopener noreferrer"
        >
            <ChartIcon class="campaigns_table_explorer__icon" />
        </a>
    </div>
</template>
<style>
.campaigns_table_explorer__root {
    @apply flex items-center;
}

.campaigns_table_explorer__icon {
    @apply w-5 h-5;
}
</style>
