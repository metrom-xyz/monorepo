<script setup lang="ts">
import { CHAIN_DATA } from "@/commons";
import { useCampaigns } from "@/composables/useCampaigns";
import SearchIcon from "@/icons/SearchIcon.vue";
import MuiTextInput from "@/ui/MuiTextInput.vue";
import MuiPairRemoteLogo from "@/ui/pair-remote-logo/MuiPairRemoteLogo.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { filterCampaigns } from "@/ui/utils/campaigns";
import { useVirtualList, watchDebounced } from "@vueuse/core";
import { type Campaign } from "sdk";
import { computed } from "vue";
import CampaignsTableDeposit from "./deposit/CampaignsTableDeposit.vue";
import { ref } from "vue";
import MuiSkeleton from "@/ui/skeleton/MuiSkeleton.vue";
import CampaignsTableRewards from "./rewards/CampaignsTableRewards.vue";
import type { CampaignsTableProps } from "./types";

const HEADERS = [
    "allCampaigns.table.header.pair",
    "allCampaigns.table.header.apr",
    "allCampaigns.table.header.rewards",
    "allCampaigns.table.header.amm",
    "allCampaigns.table.header.links",
];

const props = defineProps<CampaignsTableProps>();

const searchQuery = ref("");
const debouncedQuery = ref("");

watchDebounced(
    searchQuery,
    () => {
        debouncedQuery.value = searchQuery.value;
    },
    { debounce: 300 },
);

const { campaigns, loading: loadingCampaigns } = useCampaigns(
    computed(() => ({
        client: CHAIN_DATA[props.chain].metromSubgraphClient,
    })),
);

const items = computed<Campaign[]>(() => {
    if (!campaigns.value) return [];
    return filterCampaigns(campaigns.value, debouncedQuery.value);
});

const { containerProps, wrapperProps, list } = useVirtualList(items, {
    itemHeight: 44,
});
</script>
<template>
    <div class="campaigns_table__root">
        <div class="campaigns_table__filters">
            <MuiTextInput
                :icon="SearchIcon"
                iconLeft
                :placeholder="$t('allCampaigns.table.filters.pairs')"
                v-model="searchQuery"
                class="campaigns_table__pair__filter"
            />
        </div>
        <div class="campaigns_table__wrapper">
            <div class="campaigns_table__grid campaigns_table__header">
                <MuiTypography :key="header" v-for="header in HEADERS" medium>
                    {{ $t(header) }}
                </MuiTypography>
            </div>
            <div class="campaigns_table__divider"></div>
            <div v-bind="containerProps">
                <div v-if="loadingCampaigns">
                    <MuiSkeleton :height="36" />
                </div>
                <div
                    v-else-if="list.length > 0"
                    v-bind="wrapperProps"
                    class="campaigns_table__container"
                >
                    <div
                        :key="data.id"
                        v-for="{ data } in list"
                        class="campaigns_table__grid campaigns_table__content"
                        v-bind="{ ...data }"
                    >
                        <div class="campaigns_table__pair__row">
                            <MuiPairRemoteLogo
                                :token0="data.pair.token0"
                                :token1="data.pair.token1"
                                lg
                                class="campaigns_table__pair__logo"
                            />
                            <MuiTypography>
                                {{
                                    `${data.pair.token0.symbol} / ${data.pair.token1.symbol}`
                                }}
                            </MuiTypography>
                        </div>
                        <MuiTypography></MuiTypography>
                        <CampaignsTableRewards :rewards="data.rewards" />
                        <CampaignsTableDeposit
                            :chainId="data.chainId"
                            :ammSlug="data.amm"
                            :pair="data.pair"
                        />
                        <MuiTypography></MuiTypography>
                    </div>
                </div>
                <MuiTypography v-else>
                    {{ $t("allCampaigns.table.empty") }}
                </MuiTypography>
            </div>
        </div>
    </div>
</template>
<style>
.campaigns_table__root {
    @apply w-full flex flex-col gap-7;
}

.campaigns_table__wrapper {
    @apply max-h-[585px] w-full flex flex-col gap-3 bg-white rounded-[38px] pt-6 pb-4 px-6;
}

.campaigns_table__filters {
    @apply w-1/2 flex gap-4;
}

.campaigns_table__pair__filter {
    @apply max-w-96;
}

.campaigns_table__grid {
    @apply grid grid-cols-campaignsTable gap-8;
}

.campaigns_table__header {
}

.campaigns_table__divider {
    @apply h-[1px] border-b border-gray-400;
}

.campaigns_table__container {
    @apply flex flex-col gap-4;
}

.campaigns_table__content {
}

.campaigns_table__chain__row {
    @apply w-9 h-9;
}

.campaigns_table__pair__row {
    @apply flex gap-3 items-center;
}

.campaigns_table__pair__logo {
    @apply mr-6;
}
</style>
