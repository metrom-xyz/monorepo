<script setup lang="ts">
import {
    MetPopover,
    MetRemoteLogo,
    MetTypography,
    MetTextField,
} from "@metrom-xyz/ui";
import type { CampaignsTableRewardsProps } from "./types";
import { ref } from "vue";
import { formatUnits } from "viem";
import { formatDecimals } from "sdk";

defineProps<CampaignsTableRewardsProps>();

const popover = ref(false);
</script>
<template>
    <MetPopover :open="popover" :placement="'top-start'">
        <div
            @mouseenter="popover = true"
            @mouseleave="popover = false"
            class="campaigns_table_rewards__root"
        >
            <MetRemoteLogo
                :key="reward.token.address"
                v-for="(reward, index) in $props.rewards"
                lg
                :address="reward.token.address"
                :defaultText="reward.token.symbol"
                :style="{ left: `${24 * index}px` }"
                class="campaigns_table_reward__logo"
            />
        </div>
        <template #popover>
            <div class="campaigns_table_rewards__details">
                <div
                    :key="reward.token.address"
                    v-for="reward in $props.rewards"
                    :address="reward.token.address"
                    class="campaigns_table_rewards__details__row"
                >
                    <div class="campaigns_table_rewards__symbol">
                        <MetRemoteLogo
                            lg
                            :address="reward.token.address"
                            :defaultText="reward.token.symbol"
                        />
                        <MetTypography>{{ reward.token.symbol }}</MetTypography>
                    </div>
                    <MetTextField
                        :label="$t('allCampaigns.table.rewards.amount')"
                        :value="
                            formatDecimals({
                                number: formatUnits(
                                    reward.amount,
                                    reward.token.decimals,
                                ),
                                decimalsAmount: 6,
                            })
                        "
                    />
                    <MetTextField
                        :label="$t('allCampaigns.table.rewards.remaining')"
                        :value="
                            formatDecimals({
                                number: formatUnits(
                                    reward.remaining,
                                    reward.token.decimals,
                                ),
                                decimalsAmount: 6,
                            })
                        "
                    />
                </div>
            </div>
        </template>
    </MetPopover>
</template>
<style>
.campaigns_table_rewards__root {
    @apply w-fit flex relative items-center;
}

.campaigns_table_reward__logo {
    @apply top-0 absolute;
}

.campaigns_table_rewards__details {
    @apply flex flex-col gap-3 rounded-lg p-5;
}

.campaigns_table_rewards__details__row {
    @apply flex gap-8 items-center justify-between;
}

.campaigns_table_rewards__symbol {
    @apply flex min-w-24 gap-3 items-center;
}
</style>
