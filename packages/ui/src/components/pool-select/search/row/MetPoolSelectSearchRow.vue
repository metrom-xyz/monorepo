<script setup lang="ts">
import MetTypography from "../../../typography/MetTypography.vue";
import MetPairRemoteLogo from "../../../pair-remote-logo/MetPairRemoteLogo.vue";
import type { PoolSelectSearchRowProps } from "./types";
import { formatDecimals } from "sdk";

defineProps<PoolSelectSearchRowProps>();
</script>
<template>
    <div
        class="met_pool_select_search_row__root"
        :class="{ met_pool_select_search_row__root__selected: $props.selected }"
    >
        <MetPairRemoteLogo
            lg
            :token0="$props.token0"
            :token1="$props.token1"
            class="met_pool_select_search_row__pool_icon"
        />
        <div class="met_pool_select_search_row__pool_name">
            <MetTypography lg>
                {{ $props.token0.symbol }}
            </MetTypography>
            <MetTypography
                class="met_pool_select_search_row__pool_name_divider"
            >
                /
            </MetTypography>
            <MetTypography lg>
                {{ $props.token1.symbol }}
            </MetTypography>
            <MetTypography
                v-if="$props.fee"
                sm
                class="met_pool_select_search_row__fee"
            >
                {{
                    formatDecimals({
                        number: $props.fee.toString(),
                        decimalsAmount: 2,
                    })
                }}
                %
            </MetTypography>
        </div>
        <MetTypography
            v-if="$props.tvl"
            sm
            class="met_pool_select_search_row__tvl"
        >
            <!-- TODO: fetch tvl -->
            {{ $props.tvl }}
        </MetTypography>
        <MetTypography v-else class="met_pool_select_search_row__tvl">
            -
        </MetTypography>
    </div>
</template>
<style>
.met_pool_select_search_row__root {
    @apply flex
        gap-3
        py-3
        px-5
        justify-between
        items-center
        hover:cursor-pointer
        transition-colors
        duration-200
        ease-in-out
        hover:bg-green-200;
}

.met_pool_select_search_row__pool_icon {
    @apply min-w-16;
}

.met_pool_select_search_row__root__selected {
    @apply bg-green-200;
}

.met_pool_select_search_row__pool_name {
    @apply flex gap-3 flex-grow items-center;
}

.met_pool_select_search_row__pool_name_divider {
    @apply text-gray-600;
}

.met_pool_select_search_row__fee {
    @apply text-gray-600;
}

.met_pool_select_search_row__tvl {
    @apply text-gray-600;
}
</style>
