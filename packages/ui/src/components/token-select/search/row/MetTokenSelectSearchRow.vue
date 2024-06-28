<script setup lang="ts">
import MetTypography from "../../../typography/MetTypography.vue";
import type { TokenSelectSearchRowProps } from "./types";
import MetRemoteLogo from "../../../remote-logo/MetRemoteLogo.vue";
import MetBalance from "../../../balance/MetBalance.vue";
import MetSkeleton from "../../../skeleton/MetSkeleton.vue";

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
        <MetSkeleton v-if="$props.loadingToken" circular width="32px" />
        <MetRemoteLogo
            v-else
            lg
            :src="$props.logoURI"
            :address="$props.address"
            :defaultText="$props.symbol"
        />
        <div class="met_token_select_search_row__token_name">
            <MetSkeleton v-if="$props.loadingToken" width="64px" />
            <MetTypography v-else lg>
                {{ $props.symbol }}
            </MetTypography>
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

.met_token_select_search_row__root__disabled {
    @apply opacity-50 pointer-events-none;
}

.met_token_select_search_row__root__selected {
    @apply opacity-100 bg-green-200;
}

.met_token_select_search_row__token_name {
    @apply flex items-center justify-between gap-3 flex-grow;
}
</style>
