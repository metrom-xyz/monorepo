<script setup lang="ts">
import MuiPairRemoteLogo from "@/ui/pair-remote-logo/MuiPairRemoteLogo.vue";
import CampaignSummaryBox from "./box/CampaignSummaryBox.vue";
import type { CampaignSummaryProps } from "./types";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import PreviewDeployButton from "../campaign-creation-form/preview-deploy-button/PreviewDeployButton.vue";
import MuiTextField from "@/ui/text-field/MuiTextField.vue";

defineProps<CampaignSummaryProps>();
</script>
<template>
    <div class="campaign_summary__root">
        <div class="campaign_summary__card">
            <CampaignSummaryBox :title="$t('campaign.summary.pair')">
                <div class="campaign_summary__pair__box">
                    <MuiPairRemoteLogo
                        xxl
                        :token0="$props.state.pair?.token0"
                        :token1="$props.state.pair?.token1"
                        class="campaign_summary__pair"
                    />
                    <MuiTypography>
                        {{
                            `${$props.state.pair?.token0.symbol} / ${$props.state.pair?.token1.symbol}`
                        }}
                    </MuiTypography>
                </div>
            </CampaignSummaryBox>
            <CampaignSummaryBox :title="$t('campaign.summary.amm')">
                <div class="campaign_summary__amm__box">
                    <component
                        :is="$props.state.amm?.icon"
                        class="campaign_summary__amm__icon"
                    ></component>
                    <MuiTypography>
                        {{ $props.state.amm?.label }}
                    </MuiTypography>
                </div>
            </CampaignSummaryBox>
            <CampaignSummaryBox :title="$t('campaign.summary.rewards')">
                <div
                    :key="reward.token?.address"
                    v-for="reward in $props.state.rewards"
                    class="campaign_summary__rewards__box"
                >
                    <MuiRemoteLogo xxl :address="reward.token?.address" />
                    <MuiTypography>
                        {{ reward.token?.symbol }}
                    </MuiTypography>
                    <MuiTypography>
                        {{ reward.amount }}
                    </MuiTypography>
                </div>
            </CampaignSummaryBox>
            <CampaignSummaryBox :title="$t('campaign.summary.period')">
                <div class="campaign_summary__period__box">
                    <MuiTextField
                        :label="$t('campaign.summary.periodFrom')"
                        :value="$props.state.range?.from?.format('L HH:mm')"
                    />
                    <MuiTextField
                        :label="$t('campaign.summary.periodTo')"
                        :value="$props.state.range?.to?.format('L HH:mm')"
                    />
                </div>
            </CampaignSummaryBox>
        </div>
        <PreviewDeployButton
            variant="deploy"
            class="campaign_summary__deploy__button"
        />
    </div>
</template>
<style>
.campaign_summary__root {
    @apply flex flex-col gap-9 items-center;
}

.campaign_summary__card {
    @apply flex flex-col md:flex-row gap-8 md:gap-16 bg-white rounded-[38px] px-9 py-6;
}

.campaign_summary__pair__box {
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
