<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { CampaignsTableStatusProps } from "./types";
import dayjs from "dayjs";
import { computed } from "vue";

const props = defineProps<CampaignsTableStatusProps>();

const soon = computed(() => {
    return dayjs.unix(props.from).isAfter(dayjs());
});
const live = computed(() => {
    return (
        dayjs.unix(props.from).isBefore(dayjs()) &&
        dayjs.unix(props.to).isAfter(dayjs())
    );
});
const expired = computed(() => {
    return dayjs.unix(props.to).isBefore(dayjs());
});
</script>
<template>
    <div class="campaigns_table_status__root">
        <div
            class="campaigns_table_status__circle"
            :class="{
                campaigns_table_status__circle_soon: soon,
                campaigns_table_status__circle_live: live,
                campaigns_table_status__circle_expired: expired,
            }"
        ></div>
        <MuiTypography v-if="soon">
            {{ $t("allCampaigns.table.status.soon") }}
        </MuiTypography>
        <MuiTypography v-else-if="live">
            {{ $t("allCampaigns.table.status.live") }}
        </MuiTypography>
        <MuiTypography v-else>
            {{ $t("allCampaigns.table.status.expired") }}
        </MuiTypography>
    </div>
</template>
<style>
.campaigns_table_status__root {
    @apply flex items-center gap-2;
}

.campaigns_table_status__circle {
    @apply rounded-full w-3 h-3;
}

.campaigns_table_status__circle_soon {
    @apply bg-blue-200;
}

.campaigns_table_status__circle_live {
    @apply bg-green;
}

.campaigns_table_status__circle_expired {
    @apply bg-red-light;
}
</style>
