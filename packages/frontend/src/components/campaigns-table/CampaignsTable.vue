<script setup lang="ts">
import { CHAIN_DATA } from "@/commons";
import { useCampaigns } from "@/composables/useCampaigns";
import SearchIcon from "@/icons/SearchIcon.vue";
import MuiTextInput from "@/ui/MuiTextInput.vue";
import MuiPairRemoteLogo from "@/ui/pair-remote-logo/MuiPairRemoteLogo.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { filterCampaigns } from "@/ui/utils/campaigns";
import { watchDebounced } from "@vueuse/core";
import { type Campaign } from "sdk";
import { computed } from "vue";
import CampaignsTableDeposit from "./deposit/CampaignsTableDeposit.vue";
import { ref } from "vue";
import MuiSkeleton from "@/ui/skeleton/MuiSkeleton.vue";
import CampaignsTableRewards from "./rewards/CampaignsTableRewards.vue";
import type { CampaignsTableProps } from "./types";
import ClaimRewards from "../claim-rewards/ClaimRewards.vue";
import MuiButton from "@/ui/button/MuiButton.vue";
import ChrevronLeftIcon from "@/icons/ChrevronLeftIcon.vue";
import ChrevronRightIcon from "@/icons/ChrevronRightIcon.vue";
import CampaignsTableExplorer from "./explore/CampaignsTableExplorer.vue";

const PAGE_SIZE = 10;

const HEADERS = [
    "allCampaigns.table.header.pool",
    "allCampaigns.table.header.rewards",
    "allCampaigns.table.header.amm",
    "allCampaigns.table.header.links",
];

const props = defineProps<CampaignsTableProps>();

const searchQuery = ref("");
const debouncedQuery = ref("");
const currentPage = ref(0);

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

const totalPages = computed(
    () => Math.floor(totalCampaigns.value / PAGE_SIZE) + 1,
);
</script>
<template>
    <div class="campaigns_table__root">
        <div class="campaigns_table__filters">
            <div class="campaigns_table__pool__filter">
                <MuiTextInput
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
                <MuiTypography :key="header" v-for="header in HEADERS" medium>
                    {{ $t(header) }}
                </MuiTypography>
            </div>
            <div class="campaigns_table__divider"></div>
            <div>
                <div
                    v-if="loadingCampaigns"
                    class="campaigns_table__skeletons__container"
                >
                    <MuiSkeleton
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
                        v-bind="{ ...campaign }"
                    >
                        <div class="campaigns_table__pool__row">
                            <MuiPairRemoteLogo
                                :token0="campaign.pool.token0"
                                :token1="campaign.pool.token1"
                                lg
                                class="campaigns_table__pool__logo"
                            />
                            <MuiTypography>
                                {{
                                    `${campaign.pool.token0.symbol} / ${campaign.pool.token1.symbol}`
                                }}
                            </MuiTypography>
                        </div>
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
                <MuiTypography v-else>
                    {{ $t("allCampaigns.table.empty") }}
                </MuiTypography>
            </div>
        </div>
        <div class="campaigns_table__pagination">
            <MuiButton
                xs
                @click="currentPage -= 1"
                :disabled="currentPage === 0"
                :icon="ChrevronLeftIcon"
            />
            <MuiTypography>
                {{ currentPage + 1 }} /
                {{ totalPages }}
            </MuiTypography>
            <MuiButton
                xs
                @click="currentPage += 1"
                :disabled="currentPage + 1 === totalPages"
                :icon="ChrevronRightIcon"
            />
        </div>
    </div>
</template>
<style>
.campaigns_table__root {
    @apply w-full flex flex-col gap-7;
}

.campaigns_table__wrapper {
    @apply w-full flex flex-col gap-3 bg-white rounded-[38px] pt-6 pb-4 px-6;
}

.campaigns_table__filters {
    @apply flex gap-4 justify-between;
}

.campaigns_table__pool__filter {
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

.campaigns_table__pagination {
    @apply w-fit flex gap-2 items-center justify-between p-2 bg-white rounded-xxl self-end;
}
</style>
