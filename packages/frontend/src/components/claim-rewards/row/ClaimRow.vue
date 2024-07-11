<script setup lang="ts">
import { MetRemoteLogo, MetTextField, MetTypography } from "@metrom-xyz/ui";
import type { ClaimRowProps } from "./types";
import { formatDecimals } from "@metrom-xyz/sdk";
import { formatUnits } from "viem";

withDefaults(defineProps<ClaimRowProps>(), { logo: false });
</script>
<template>
    <div class="claim_row__root">
        <div v-if="logo" class="claim_row__claim">
            <MetRemoteLogo
                v-bind="$props"
                :address="$props.claim.token.address"
                :defaultText="$props.claim.token.symbol"
            />
            <MetTypography>
                {{ $props.claim.token.symbol }}
            </MetTypography>
        </div>
        <MetTextField
            :label="$t('allCampaigns.rewards.remaining')"
            :value="
                formatDecimals({
                    number: formatUnits(
                        $props.claim.remaining,
                        $props.claim.token.decimals,
                    ),
                })
            "
        />
        <MetTextField
            :label="$t('allCampaigns.rewards.amount')"
            :value="
                formatDecimals({
                    number: formatUnits(
                        $props.claim.amount,
                        $props.claim.token.decimals,
                    ),
                })
            "
        />
    </div>
</template>
<style>
.claim_row__root {
    @apply w-full
        flex
        flex-row
        justify-between
        items-center;
}

.claim_row__claim {
    @apply min-w-28 flex gap-3 items-center;
}
</style>
