<script setup lang="ts">
import type { CampaignsTableDepositProps } from "./types";
import { computed } from "vue";
import { getAmm, getPairAddLiquidityLink } from "@/utils/amm";

const props = defineProps<CampaignsTableDepositProps>();

const amm = computed(() => {
    const amm = getAmm(props.chainId, props.ammSlug);
    if (!amm) return null;

    return {
        addLiquidityUrl: getPairAddLiquidityLink(amm, props.pair),
        logo: amm.logo,
    };
});
</script>
<template>
    <div class="campaigns_table_deposit__root">
        <a
            v-if="amm?.addLiquidityUrl"
            :href="amm.addLiquidityUrl"
            target="_blank"
            rel="noopener noreferrer"
        >
            <component
                :is="amm?.logo"
                class="campaigns_table_deposit__amm__icon"
            ></component>
        </a>
    </div>
</template>
<style>
.campaigns_table_deposit__root {
    @apply flex items-center;
}

.campaigns_table_deposit__amm__icon {
    @apply w-6 h-6;
}
</style>
