<script setup lang="ts">
import MuiRemoteLogo from "../remote-logo/MuiRemoteLogo.vue";
import type { PairRemoteLogoProps } from "./types";

defineProps<PairRemoteLogoProps>();
</script>
<template>
    <div class="mui_pair_remote_logo__root">
        <MuiRemoteLogo
            :address="$props.token0.address"
            :defaultText="$props.token0.symbol"
            class="mui_pair_remote_logo__token0"
        />
        <MuiRemoteLogo
            :address="$props.token1.address"
            :defaultText="$props.token1.symbol"
            class="mui_pair_remote_logo__token1"
        />
    </div>
</template>
<style>
.mui_pair_remote_logo__root {
    @apply relative flex;
}

.mui_pair_remote_logo__token0 {
    @apply z-[1] rounded-full shadow shadow-gray-500;
}

.mui_pair_remote_logo__token1 {
    @apply absolute left-6;
}
</style>
