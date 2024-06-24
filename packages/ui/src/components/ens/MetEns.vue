<script setup lang="ts">
import { useEnsName } from "vevm";
import type { EnsProps } from "./types";
import MetTypography from "../typography/MetTypography.vue";
import { shortenAddress } from "sdk";
import type { TypographyProps } from "../typography/types";

const props = defineProps<EnsProps & TypographyProps>();

// FIXME: check why it's always undefined
const { ensName } = useEnsName({ address: props.address });
</script>
<template>
    <MetTypography v-bind="$props">
        {{
            ensName || props.short
                ? shortenAddress(props.address, true)
                : props.address
        }}
    </MetTypography>
</template>
<style></style>
