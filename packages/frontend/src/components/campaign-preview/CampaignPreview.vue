<script setup lang="ts">
import { ref } from "vue";
import ApproveRewards from "./approve-rewards/ApproveRewards.vue";
import PreviewBox from "./PreviewBox.vue";
import DeployButton from "./deploy-button/DeployButton.vue";
import type { CampaignPreviewProps } from "./types";
import {
    MetPairRemoteLogo,
    MetTypography,
    MetRemoteLogo,
    MetTextField,
} from "@metrom-xyz/ui";
import { computed } from "vue";
import { CHAIN_DATA } from "@/commons";
import { useChainId } from "vevm";
import SubmitButton from "../submit-button/SubmitButton.vue";
import LineArrowLeftIcon from "@/icons/LineArrowLeftIcon.vue";
import { formatUnits } from "viem";
import { formatDecimals } from "@metrom-xyz/sdk";
import PoolIcon from "@/icons/PoolIcon.vue";
import CalendarIcon from "@/icons/CalendarIcon.vue";
import CupIcon from "@/icons/CupIcon.vue";

defineProps<CampaignPreviewProps>();
const emits = defineEmits(["edited"]);

const chainId = useChainId();

const allRewardsApproved = ref(false);
const deployed = ref(false);

const metrom = computed(() => {
    return CHAIN_DATA[chainId.value].contract;
});
</script>
<template>
    <div class="campaign_preview__root">
        <SubmitButton
            :disabled="$props.disabled"
            :icon="LineArrowLeftIcon"
            iconLeft
            :onClick="() => emits('edited')"
        >
            <MetTypography>{{ $t("campaign.preview.back") }}</MetTypography>
        </SubmitButton>
        <div class="campaign_preview__card">
            <div class="campaign_preview__summary">
                <MetTypography h3 class="campaign_preview__centered__title">
                    {{ $t("campaign.preview.summary") }}
                </MetTypography>
                <div class="campaign_preview__card__row">
                    <PreviewBox>
                        <template #title>
                            <div class="campaign_preview__box__title">
                                <PoolIcon />
                                <MetTypography lg>
                                    {{ $t("campaign.preview.pool") }}
                                </MetTypography>
                            </div>
                        </template>
                        <div class="campaign_preview__pool__box">
                            <MetPairRemoteLogo
                                xxl
                                :token0="$props.state.pool?.token0"
                                :token1="$props.state.pool?.token1"
                                class="campaign_preview__pair"
                            />
                            <MetTypography>
                                {{
                                    `${$props.state.pool?.token0.symbol} / ${$props.state.pool?.token1.symbol}`
                                }}
                            </MetTypography>
                        </div>
                    </PreviewBox>
                    <PreviewBox>
                        <template #title>
                            <div class="campaign_preview__box__title">
                                <CalendarIcon />
                                <MetTypography lg>
                                    {{ $t("campaign.preview.period") }}
                                </MetTypography>
                            </div>
                        </template>
                        <div class="campaign_preview__period__box">
                            <MetTextField
                                :label="$t('campaign.preview.periodFrom')"
                                :value="
                                    $props.state.range?.from?.format('L HH:mm')
                                "
                            />
                            <MetTextField
                                :label="$t('campaign.preview.periodTo')"
                                :value="
                                    $props.state.range?.to?.format('L HH:mm')
                                "
                            />
                        </div>
                    </PreviewBox>
                </div>
                <PreviewBox>
                    <template #title>
                        <div class="campaign_preview__box__title">
                            <CupIcon />
                            <MetTypography lg>
                                {{ $t("campaign.preview.rewards") }}
                            </MetTypography>
                        </div>
                    </template>
                    <div class="campaign_preview__rewards__wrapper">
                        <div
                            :key="reward.token?.address"
                            v-for="reward in $props.state.rewards"
                            class="campaign_preview__rewards__box"
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
                                {{
                                    formatDecimals({
                                        number: formatUnits(
                                            reward.amount,
                                            reward.token.decimals,
                                        ),
                                        decimalsAmount: 10,
                                    })
                                }}
                            </MetTypography>
                        </div>
                    </div>
                </PreviewBox>
            </div>
        </div>
        <ApproveRewards
            v-if="!allRewardsApproved && metrom"
            :disabled="$props.disabled"
            :rewards="$props.state.rewards"
            :metrom="metrom"
            @allApproved="allRewardsApproved = true"
        />
        <DeployButton
            v-else
            :disabled="$props.disabled"
            :metrom="metrom"
            :state="$props.state"
            @deployed="deployed = true"
        />
    </div>
</template>
<style>
.campaign_preview__root {
    @apply flex flex-col gap-7 items-center;
}

.campaign_preview__root > .submit_button__root {
    @apply max-w-[328px];
}

.campaign_preview__card {
    @apply flex
        flex-col
        gap-7
        bg-white
        rounded-[38px]
        px-10
        py-8;
}

.campaign_preview__summary {
    @apply flex flex-col gap-7;
}

.campaign_preview__restrictions {
    @apply flex flex-col gap-7;
}

.campaign_preview__centered__title {
    @apply text-center font-normal;
}

.campaign_preview__card__row {
    @apply flex justify-between gap-7;
}

.campaign_preview__box__title {
    @apply flex gap-4;
}

.campaign_preview__pool__box {
    @apply flex gap-3 items-center;
}

.campaign_preview__amm__box {
    @apply flex gap-3 items-center;
}

.campaign_preview__rewards__wrapper {
    @apply flex flex-col sm:flex-row flex-wrap gap-3;
}

.campaign_preview__rewards__box {
    @apply flex flex-1 gap-3 items-center;
}

.campaign_preview__period__box {
    @apply flex
        flex-col
        sm:flex-row
        gap-6
        items-center;
}

.campaign_preview__pair {
    @apply mr-6;
}

.campaign_preview__amm__icon {
    @apply w-10 h-10;
}

.campaign_preview__deploy__button {
    @apply max-w-96;
}
</style>
