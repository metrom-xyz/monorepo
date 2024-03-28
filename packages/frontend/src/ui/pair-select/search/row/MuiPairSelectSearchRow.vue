<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { PairSelectSearchRowProps } from "./types";
import MuiPairRemoteLogo from "@/ui/pair-remote-logo/MuiPairRemoteLogo.vue";

defineProps<PairSelectSearchRowProps>();
</script>
<template>
    <div
        class="mui_pair_select_search_row__root"
        :class="{ mui_pair_select_search_row__root__selected: $props.selected }"
    >
        <MuiPairRemoteLogo
            :token0="$props.token0"
            :token1="$props.token1"
            class="mui_pair_select_search_row__pair_icon"
        />
        <div class="mui_pair_select_search_row__pair_name">
            <MuiTypography lg>
                {{ $props.token0.symbol }}
            </MuiTypography>
            <MuiTypography
                class="mui_pair_select_search_row__pair_name_divider"
            >
                /
            </MuiTypography>
            <MuiTypography lg>
                {{ $props.token1.symbol }}
            </MuiTypography>
        </div>
        <MuiTypography sm class="mui_pair_select_search_row__tvl">
            {{ $props.tvl }}
        </MuiTypography>
    </div>
</template>
<style>
.mui_pair_select_search_row__root {
    @apply flex gap-3 p-3 justify-between items-center rounded-xl hover:cursor-pointer hover:bg-green-light;
}

.mui_pair_select_search_row__pair_icon {
    @apply min-w-16;
}

.mui_pair_select_search_row__root__selected {
    @apply bg-green-light;
}

.mui_pair_select_search_row__pair_name {
    @apply flex gap-3 flex-grow mr-16;
}

.mui_pair_select_search_row__pair_name_divider {
    @apply text-gray-600;
}

.mui_pair_select_search_row__tvl {
    @apply text-gray-600;
}
</style>
