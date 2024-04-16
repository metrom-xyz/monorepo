<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { TokenSelectSearchRowProps } from "./types";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import MuiBalance from "@/ui/balance/MuiBalance.vue";
import MuiSkeleton from "@/ui/skeleton/MuiSkeleton.vue";

defineProps<TokenSelectSearchRowProps>();
</script>
<template>
    <div
        class="mui_token_select_search_row__root"
        :class="{
            mui_token_select_search_row__root__disabled: $props.disabled,
            mui_token_select_search_row__root__selected: $props.selected,
        }"
    >
        <MuiSkeleton v-if="$props.loading" circular width="32px" />
        <MuiRemoteLogo
            v-else
            lg
            :address="$props.address"
            :defaultText="$props.symbol"
        />
        <div class="mui_token_select_search_row__token_name">
            <MuiSkeleton v-if="$props.loading" width="64px" />
            <MuiTypography v-else lg>
                {{ $props.symbol }}
            </MuiTypography>
            <MuiBalance
                :balance="$props.balance"
                :decimals="$props.decimals"
                :loading="$props.loading || $props.loadingBalances"
            />
        </div>
    </div>
</template>
<style>
.mui_token_select_search_row__root {
    @apply flex gap-3 p-3 justify-between items-center rounded-xl hover:cursor-pointer hover:bg-green-light;
}

.mui_token_select_search_row__root__disabled {
    @apply opacity-50 pointer-events-none;
}

.mui_token_select_search_row__root__selected {
    @apply opacity-100 bg-green-light;
}

.mui_token_select_search_row__token_name {
    @apply flex items-center justify-between gap-3 flex-grow;
}
</style>
