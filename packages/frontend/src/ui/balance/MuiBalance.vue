<script setup lang="ts">
import { formatDecimals } from "sdk";
import type { BalanceProps } from "./types";
import { formatUnits } from "viem";
import MuiTypography from "../typography/MuiTypography.vue";
import MuiSkeleton from "../skeleton/MuiSkeleton.vue";

withDefaults(defineProps<BalanceProps>(), { decimals: 18 });
</script>
<template>
    <MuiSkeleton v-if="$props.loading" width="40px" />
    <MuiTypography v-else-if="$props.balance" sm>
        {{
            formatDecimals({
                number: formatUnits($props.balance, $props.decimals || 18),
            })
        }}
    </MuiTypography>
</template>
<style></style>
