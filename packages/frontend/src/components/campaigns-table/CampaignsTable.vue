<script setup lang="ts">
import { CHAIN_DATA } from "@/commons";
import { useCampaigns } from "@/composables/useCampaigns";
import SearchIcon from "@/icons/SearchIcon.vue";
import {
    MetTextInput,
    MetPairRemoteLogo,
    MetTypography,
    MetSkeleton,
    MetButton,
} from "@metrom-xyz/ui";
import { filterCampaigns } from "../../utils/campaigns";
import { watchDebounced } from "@vueuse/core";
import { type Campaign } from "@metrom-xyz/sdk";
import { computed } from "vue";
import CampaignsTableDeposit from "./deposit/CampaignsTableDeposit.vue";
import { ref } from "vue";
import CampaignsTableRewards from "./rewards/CampaignsTableRewards.vue";
import type { CampaignsTableProps } from "./types";
import ClaimRewards from "../claim-rewards/ClaimRewards.vue";
import ChevronLeftIcon from "@/icons/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/icons/ChevronRightIcon.vue";
import CampaignsTableExplorer from "./explore/CampaignsTableExplorer.vue";
import CampaignsTablePeriod from "./period/CampaignsTablePeriod.vue";

const PAGE_SIZE = 10;

const HEADERS = [
    "allCampaigns.table.header.pool",
    "allCampaigns.table.header.period",
    "allCampaigns.table.header.rewards",
    "allCampaigns.table.header.amm",
    "allCampaigns.table.header.links",
];

const HEADERS_SM = [
    "allCampaigns.table.header.pool",
    "allCampaigns.table.header.period",
    "allCampaigns.table.header.rewards",
    "allCampaigns.table.header.amm",
];

const props = defineProps<CampaignsTableProps>();

const searchQuery = ref("");
const debouncedQuery = ref("");
const currentPage = ref(1);

watchDebounced(
    searchQuery,
    () => {
        debouncedQuery.value = searchQuery.value;
    },
    { debounce: 300 },
);

const {
    amount: totalCampaigns,
    campaigns,
    loading: loadingCampaigns,
} = useCampaigns(
    computed(() => ({
        client: CHAIN_DATA[props.chain].metromApiClient,
        pageNumber: currentPage.value,
        pageSize: PAGE_SIZE,
    })),
);

const items = computed<Campaign[]>(() => {
    if (!campaigns.value) return [];
    return filterCampaigns(campaigns.value, debouncedQuery.value);
});

const totalPages = computed(() =>
    Number(totalCampaigns.value / BigInt(PAGE_SIZE) + 1n),
);
</script>
<template>
    <div class="campaigns_table__root">
        <div class="campaigns_table__filters">
            <div class="campaigns_table__pool__filter">
                <MetTextInput
                    :icon="SearchIcon"
                    iconLeft
                    :placeholder="$t('allCampaigns.table.filters.pools')"
                    v-model="searchQuery"
                />
            </div>
            <ClaimRewards :chain="$props.chain" />
        </div>
        <div class="campaigns_table__wrapper">
            <div class="campaigns_table__grid campaigns_table__header">
                <MetTypography :key="header" v-for="header in HEADERS" medium>
                    {{ $t(header) }}
                </MetTypography>
            </div>
            <div class="campaigns_table__grid campaigns_table__header__sm">
                <MetTypography
                    :key="header"
                    v-for="header in HEADERS_SM"
                    medium
                >
                    {{ $t(header) }}
                </MetTypography>
            </div>
            <div class="campaigns_table__divider"></div>
            <div>
                <div
                    v-if="loadingCampaigns"
                    class="campaigns_table__skeletons__container"
                >
                    <MetSkeleton
                        :key="size"
                        v-for="size in PAGE_SIZE"
                        :height="32"
                    />
                </div>
                <div
                    v-else-if="items.length > 0"
                    class="campaigns_table__container"
                >
                    <div
                        :key="campaign.id"
                        v-for="campaign in items"
                        class="campaigns_table__grid campaigns_table__content"
                    >
                        <div class="campaigns_table__pool__row">
                            <MetPairRemoteLogo
                                :token0="campaign.pool.token0"
                                :token1="campaign.pool.token1"
                                lg
                                class="campaigns_table__pool__logo"
                            />
                            <MetTypography class="campaigns_table__pool__name">
                                {{
                                    `${campaign.pool.token0.symbol} / ${campaign.pool.token1.symbol}`
                                }}
                            </MetTypography>
                        </div>
                        <CampaignsTablePeriod
                            :from="campaign.from"
                            :to="campaign.to"
                        />
                        <CampaignsTableRewards :rewards="campaign.rewards" />
                        <CampaignsTableDeposit
                            :chainId="campaign.pool.token0.chainId"
                            :ammSlug="campaign.pool.amm"
                            :pool="campaign.pool"
                        />
                        <CampaignsTableExplorer
                            :chainId="campaign.pool.token0.chainId"
                            :ammSlug="campaign.pool.amm"
                            :pool="campaign.pool"
                        />
                    </div>
                </div>
                <MetTypography v-else>
                    {{ $t("allCampaigns.table.empty") }}
                </MetTypography>
            </div>
        </div>
        <div class="campaigns_table__pagination">
            <MetButton
                xs
                @click="currentPage -= 1"
                :disabled="currentPage === 1"
                :icon="ChevronLeftIcon"
            />
            <MetTypography>
                {{ currentPage }} /
                {{ totalPages }}
            </MetTypography>
            <MetButton
                xs
                @click="currentPage += 1"
                :disabled="currentPage === totalPages"
                :icon="ChevronRightIcon"
            />
        </div>
    </div>
</template>
<style>
.campaigns_table__root {
    @apply w-full flex flex-col gap-4 sm:gap-7;
}

.campaigns_table__wrapper {
    @apply w-full
        min-h-[550px]
        sm:min-w-[800px]
        flex
        flex-col
        gap-3
        bg-white
        rounded-[38px]
        pt-6
        pb-4
        px-6;
}

.campaigns_table__filters {
    @apply flex gap-4 justify-between;
}

.campaigns_table__pool__filter {
    @apply max-w-96;
}

.campaigns_table__grid {
    @apply grid
        grid-cols-campaignsTableSm
        sm:grid-cols-campaignsTable
        gap-8;
}

.campaigns_table__header {
    @apply hidden sm:grid;
}

.campaigns_table__header__sm {
    @apply grid sm:hidden;
}

.campaigns_table__divider {
    @apply h-[1px] border-b border-gray-400;
}

.campaigns_table__skeletons__container {
    @apply flex flex-col gap-4;
}

.campaigns_table__container {
    @apply flex flex-col gap-4;
}

.campaigns_table__content {
}

.campaigns_table__chain__row {
    @apply w-9 h-9;
}

.campaigns_table__pool__row {
    @apply flex gap-3 items-center;
}

.campaigns_table__pool__logo {
    @apply mr-6;
}

.campaigns_table__pool__name {
    @apply hidden sm:flex;
}

.campaigns_table__pagination {
    @apply w-fit flex gap-2 items-center justify-between p-2 bg-white rounded-xxl self-end;
}
</style>
