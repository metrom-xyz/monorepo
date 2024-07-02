<script setup lang="ts">
import type { CampaignsTableExplorerProps } from "./types";
import { computed } from "vue";
import { getPoolExplorerLink } from "@/utils/amm";
import ChartIcon from "@/icons/ChartIcon.vue";
import { MetTypography } from "@metrom-xyz/ui";

const props = defineProps<CampaignsTableExplorerProps>();

const poolExplorerLink = computed(() => {
    return getPoolExplorerLink(props.chainId, props.ammSlug, props.pool);
});
</script>
<template>
    <div class="campaigns_table_explorer__root">
        <a
            v-if="poolExplorerLink"
            :href="poolExplorerLink"
            target="_blank"
            rel="noopener noreferrer"
        >
            <ChartIcon class="campaigns_table_explorer__icon" />
        </a>
        <MetTypography v-else>-</MetTypography>
    </div>
</template>
<style>
.campaigns_table_explorer__root {
    @apply hidden sm:flex items-center;
}

.campaigns_table_explorer__icon {
    @apply w-5 h-5;
}
</style>
