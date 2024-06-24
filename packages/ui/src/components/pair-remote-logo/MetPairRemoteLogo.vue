<script setup lang="ts">
import MetRemoteLogo from "../remote-logo/MetRemoteLogo.vue";
import type { PairRemoteLogoProps } from "./types";

defineProps<PairRemoteLogoProps>();
</script>
<template>
    <div class="met_pair_remote_logo__root">
        <MetRemoteLogo
            :address="$props.token0?.address"
            :defaultText="$props.token0?.symbol"
            :sm="$props.sm"
            :lg="$props.lg"
            :xl="$props.xl"
            :xxl="$props.xxl"
            class="met_pair_remote_logo__token0"
        />
        <MetRemoteLogo
            :address="$props.token1?.address"
            :defaultText="$props.token1?.symbol"
            :sm="$props.sm"
            :lg="$props.lg"
            :xl="$props.xl"
            :xxl="$props.xxl"
            class="met_pair_remote_logo__token1"
        />
    </div>
</template>
<style>
.met_pair_remote_logo__root {
    @apply relative flex;
}

.met_pair_remote_logo__token0 {
    @apply z-[1] rounded-full;
}

.met_pair_remote_logo__token1 {
    @apply absolute left-6;
}
</style>
