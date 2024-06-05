<script setup lang="ts">
import MuiPopover from "@/ui/popover/MuiPopover.vue";
import type { CampaignsTableRewardsProps } from "./types";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import { ref } from "vue";
import { formatUnits } from "viem";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiTextField from "@/ui/text-field/MuiTextField.vue";
import { formatDecimals } from "sdk";

defineProps<CampaignsTableRewardsProps>();

const popover = ref(false);
</script>
<template>
    <MuiPopover :open="popover" :placement="'top-start'">
        <div
            @mouseenter="popover = true"
            @mouseleave="popover = false"
            class="campaigns_table_rewards__root"
        >
            <MuiRemoteLogo
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
                        <MuiRemoteLogo
                            lg
                            :address="reward.token.address"
                            :defaultText="reward.token.symbol"
                        />
                        <MuiTypography>{{ reward.token.symbol }}</MuiTypography>
                    </div>
                    <MuiTextField
                        :label="$t('allCampaigns.table.rewards.amount')"
                        :value="
                            formatDecimals({
                                number: formatUnits(
                                    reward.amount,
                                    reward.token.decimals,
                                ),
                            })
                        "
                    />
                    <MuiTextField
                        :label="$t('allCampaigns.table.rewards.remaining')"
                        :value="
                            formatDecimals({
                                number: formatUnits(
                                    reward.remaining,
                                    reward.token.decimals,
                                ),
                            })
                        "
                    />
                </div>
            </div>
        </template>
    </MuiPopover>
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
