<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiPairRemoteLogo from "@/ui/pair-remote-logo/MuiPairRemoteLogo.vue";
import type { PoolSelectSearchRowProps } from "./types";

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
        </div>
        <MuiTypography sm class="mui_pool_select_search_row__tvl">
            <!-- TODO: fetch tvl -->
            {{ $props?.tvl }}
        </MuiTypography>
    </div>
</template>
<style>
.mui_pool_select_search_row__root {
    @apply flex gap-3 p-3 justify-between items-center rounded-xl hover:cursor-pointer hover:bg-green-light;
}

.mui_pool_select_search_row__pool_icon {
    @apply min-w-16;
}

.mui_pool_select_search_row__root__selected {
    @apply bg-green-light;
}

.mui_pool_select_search_row__pool_name {
    @apply flex gap-3 flex-grow mr-16 items-center;
}

.mui_pool_select_search_row__pool_name_divider {
    @apply text-gray-600;
}

.mui_pool_select_search_row__tvl {
    @apply text-gray-600;
}
</style>
