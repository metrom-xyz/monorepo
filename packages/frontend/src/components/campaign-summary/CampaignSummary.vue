<script setup lang="ts">
import CampaignSummaryBox from "./box/CampaignSummaryBox.vue";
import type { CampaignSummaryProps } from "./types";
import {
    MetPairRemoteLogo,
    MetTypography,
    MetRemoteLogo,
    MetTextField,
} from "@metrom-xyz/ui";

defineProps<CampaignSummaryProps>();
</script>
<template>
    <div class="campaign_summary__root">
        <div class="campaign_summary__card">
            <CampaignSummaryBox :title="$t('campaign.summary.pool')">
                <div class="campaign_summary__pool__box">
                    <MetPairRemoteLogo
                        xxl
                        :token0="$props.state.pool?.token0"
                        :token1="$props.state.pool?.token1"
                        class="campaign_summary__pair"
                    />
                    <MetTypography>
                        {{
                            `${$props.state.pool?.token0.symbol} / ${$props.state.pool?.token1.symbol}`
                        }}
                    </MetTypography>
                </div>
            </CampaignSummaryBox>
            <CampaignSummaryBox :title="$t('campaign.summary.amm')">
                <div class="campaign_summary__amm__box">
                    <component
                        :is="$props.state.amm?.icon"
                        class="campaign_summary__amm__icon"
                    ></component>
                    <MetTypography>
                        {{ $props.state.amm?.label }}
                    </MetTypography>
                </div>
            </CampaignSummaryBox>
            <CampaignSummaryBox :title="$t('campaign.summary.rewards')">
                <div
                    :key="reward.token?.address"
                    v-for="reward in $props.state.rewards"
                    class="campaign_summary__rewards__box"
                >
                    <MetRemoteLogo
                        xxl
                        :address="reward.token?.address"
                        :defaultText="reward.token?.symbol"
                    />
                    <MetTypography>
                        {{ reward.token?.symbol }}
                    </MetTypography>
                    <MetTypography>
                        {{ reward.amount }}
                    </MetTypography>
                </div>
            </CampaignSummaryBox>
            <CampaignSummaryBox :title="$t('campaign.summary.period')">
                <div class="campaign_summary__period__box">
                    <MetTextField
                        :label="$t('campaign.summary.periodFrom')"
                        :value="$props.state.range?.from?.format('L HH:mm')"
                    />
                    <MetTextField
                        :label="$t('campaign.summary.periodTo')"
                        :value="$props.state.range?.to?.format('L HH:mm')"
                    />
                </div>
            </CampaignSummaryBox>
        </div>
    </div>
</template>
<style>
.campaign_summary__root {
    @apply flex flex-col gap-9 items-center;
}

.campaign_summary__card {
    @apply flex flex-col md:flex-row gap-8 md:gap-16 bg-white rounded-[38px] px-9 py-6;
}

.campaign_summary__pool__box {
    @apply flex gap-3 items-center;
}

.campaign_summary__amm__box {
    @apply flex gap-3 items-center;
}

.campaign_summary__rewards__box {
    @apply flex gap-3 items-center;
}

.campaign_summary__period__box {
    @apply flex gap-14 items-center;
}

.campaign_summary__pair {
    @apply mr-6;
}

.campaign_summary__amm__icon {
    @apply w-10 h-10;
}

.campaign_summary__deploy__button {
    @apply max-w-96;
}
</style>
