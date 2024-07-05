<script setup lang="ts">
import { formatDecimals } from "@metrom-xyz/sdk";
import type { BalanceProps } from "./types";
import { formatUnits } from "viem";
import MetTypography from "../typography/MetTypography.vue";
import MetSkeleton from "../skeleton/MetSkeleton.vue";

withDefaults(defineProps<BalanceProps>(), { decimals: 18 });
</script>
<template>
    <MetSkeleton v-if="$props.loading" width="40px" />
    <MetTypography v-else-if="$props.balance" sm>
        {{
            formatDecimals({
                number: formatUnits($props.balance, $props.decimals || 18),
            })
        }}
    </MetTypography>
</template>
<style></style>
