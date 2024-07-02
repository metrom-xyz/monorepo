<script setup lang="ts">
import { MetProgressBar, MetPopover, MetTextField } from "@metrom-xyz/ui";
import type { CampaignsTablePeriodProps } from "./types";
import { computed } from "vue";
import dayjs from "dayjs";
import { ref } from "vue";

const props = defineProps<CampaignsTablePeriodProps>();

const popover = ref(false);

const progress = computed(() => {
    const from = dayjs.unix(props.from);
    const to = dayjs.unix(props.to);

    if (from.isAfter(dayjs())) return 0;
    if (to.isBefore(dayjs())) return 100;

    const duration = to.diff(from, "seconds");
    const timeLeft = to.diff(dayjs(), "seconds");

    return ((duration - timeLeft) / duration) * 100;
});
</script>
<template>
    <MetPopover :open="popover" :placement="'top-start'">
        <div
            class="campaign_table_period__wrapper"
            @mouseenter="popover = true"
            @mouseleave="popover = false"
        >
            <MetProgressBar :progress="progress" />
        </div>
        <template #popover>
            <div class="campaign_table_period__popover">
                <MetTextField
                    :label="$t('allCampaigns.table.period.from')"
                    :value="dayjs.unix($props.from).format('DD MMM YYYY HH:mm')"
                />
                <MetTextField
                    :label="$t('allCampaigns.table.period.to')"
                    :value="dayjs.unix($props.to).format('DD MMM YYYY HH:mm')"
                />
            </div>
        </template>
    </MetPopover>
</template>
<style>
.campaign_table_period__wrapper {
    @apply flex h-full items-center;
}

.campaign_table_period__popover {
    @apply flex gap-4 rounded-lg p-5;
}
</style>
