<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiPairRemoteLogo from "@/ui/pair-remote-logo/MuiPairRemoteLogo.vue";
import type { PoolSelectSearchRowProps } from "./types";
import { formatDecimals } from "sdk";

defineProps<PoolSelectSearchRowProps>();
</script>
<template>
    <div
        class="mui_pool_select_search_row__root"
        :class="{ mui_pool_select_search_row__root__selected: $props.selected }"
    >
        <MuiPairRemoteLogo
            lg
            :token0="$props.token0"
            :token1="$props.token1"
            class="mui_pool_select_search_row__pool_icon"
        />
        <div class="mui_pool_select_search_row__pool_name">
            <MuiTypography lg>
                {{ $props.token0.symbol }}
            </MuiTypography>
            <MuiTypography
                class="mui_pool_select_search_row__pool_name_divider"
            >
                /
            </MuiTypography>
            <MuiTypography lg>
                {{ $props.token1.symbol }}
            </MuiTypography>
            <MuiTypography
                v-if="$props.fee"
                sm
                class="mui_pool_select_search_row__fee"
            >
                {{
                    formatDecimals({
                        number: $props.fee.toString(),
                        decimalsAmount: 2,
                    })
                }}
                %
            </MuiTypography>
        </div>
        <MuiTypography
            v-if="$props.tvl"
            sm
            class="mui_pool_select_search_row__tvl"
        >
            <!-- TODO: fetch tvl -->
            {{ $props.tvl }}
        </MuiTypography>
    </div>
</template>
<style>
.mui_pool_select_search_row__root {
    @apply flex
        gap-3
        p-3
        justify-between
        items-center
        rounded-xl
        hover:cursor-pointer
        transition-colors
        duration-200
        ease-in-out
        hover:bg-green-200;
}

.mui_pool_select_search_row__pool_icon {
    @apply min-w-16;
}

.mui_pool_select_search_row__root__selected {
    @apply bg-green-200;
}

.mui_pool_select_search_row__pool_name {
    @apply flex gap-3 flex-grow items-center;
}

.mui_pool_select_search_row__pool_name_divider {
    @apply text-gray-600;
}

.mui_pool_select_search_row__fee {
    @apply text-gray-600;
}

.mui_pool_select_search_row__tvl {
    @apply text-gray-600;
}
</style>
