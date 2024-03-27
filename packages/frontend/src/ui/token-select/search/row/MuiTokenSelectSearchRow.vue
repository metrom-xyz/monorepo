<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { TokenSelectSearchRowProps } from "./types";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";

defineProps<TokenSelectSearchRowProps>();
</script>
<template>
    <div
        class="mui_token_select_search_row__root"
        :class="{
            mui_token_select_search_row__root__selected: $props.selected,
        }"
    >
        <MuiRemoteLogo :address="$props.address" :defaultText="$props.symbol" />
        <div class="mui_token_select_search_row__token_name">
            <MuiTypography lg>
                {{ $props.symbol }}
            </MuiTypography>
        </div>
    </div>
</template>
<style>
.mui_token_select_search_row__root {
    @apply flex gap-3 p-3 justify-between items-center rounded-xl hover:cursor-pointer hover:bg-green-light;
}

.mui_token_select_search_row__root__selected {
    @apply bg-green-light;
}

.mui_token_select_search_row__token_name {
    @apply flex gap-3 flex-grow mr-16;
}
</style>
