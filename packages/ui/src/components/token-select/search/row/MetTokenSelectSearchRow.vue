<script setup lang="ts">
import MetTypography from "../../../typography/MetTypography.vue";
import type { TokenSelectSearchRowProps } from "./types";
import MetRemoteLogo from "../../../remote-logo/MetRemoteLogo.vue";
import MetBalance from "../../../balance/MetBalance.vue";
import MetSkeleton from "../../../skeleton/MetSkeleton.vue";
import { formatDecimals } from "@metrom-xyz/sdk";
import { formatUnits } from "viem";

defineProps<TokenSelectSearchRowProps>();
</script>
<template>
    <div
        class="met_token_select_search_row__root"
        :class="{
            met_token_select_search_row__root__disabled: $props.disabled,
            met_token_select_search_row__root__selected: $props.selected,
        }"
    >
        <div class="met_token_select_search_row__token__name">
            <MetSkeleton v-if="$props.loadingToken" circular width="32px" />
            <MetRemoteLogo
                v-else
                lg
                :src="$props.logoURI"
                :address="$props.address"
                :defaultText="$props.symbol"
            />
            <MetSkeleton v-if="$props.loadingToken" width="64px" />
            <MetTypography v-else lg>
                {{ $props.symbol }}
            </MetTypography>
        </div>
        <div class="met_token_select_search_row__distribution__rate">
            <MetSkeleton v-if="$props.loadingToken" width="40px" />
            <MetTypography v-else>
                {{
                    formatDecimals({
                        number: formatUnits(
                            $props.minimumRate || 0n,
                            $props.decimals,
                        ),
                        decimalsAmount: 6,
                    })
                }}
            </MetTypography>
        </div>
        <div class="met_token_select_search_row__balance">
            <MetBalance
                :balance="$props.balance"
                :decimals="$props.decimals"
                :loading="$props.loadingBalance"
            />
        </div>
    </div>
</template>
<style>
.met_token_select_search_row__root {
    @apply grid
        grid-cols-tokenSelectRow
        gap-8
        py-3
        px-5
        items-center
        hover:cursor-pointer
        transition-colors
        duration-200
        ease-in-out
        hover:bg-green-200;
}

.met_token_select_search_row__root__disabled {
    @apply opacity-50 pointer-events-none;
}

.met_token_select_search_row__root__selected {
    @apply opacity-100 bg-green-200;
}

.met_token_select_search_row__token__name {
    @apply flex items-center gap-3;
}

.met_token_select_search_row__distribution__rate {
    @apply text-right;
}

.met_token_select_search_row__balance {
    @apply text-right;
}
</style>
