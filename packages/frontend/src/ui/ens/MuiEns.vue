<script setup lang="ts">
import { useEnsName } from "vevm";
import type { EnsProps } from "./types";
import MuiTypography from "../typography/MuiTypography.vue";
import { shortenAddress } from "@/utils/address";
import type { TypographyProps } from "../typography/types";

const props = defineProps<EnsProps & TypographyProps>();

// FIXME: check why it's always undefined
const { ensName } = useEnsName({ address: props.address });
</script>
<template>
    <MuiTypography v-bind="$props">
        {{
            ensName || props.short
                ? shortenAddress(props.address)
                : props.address
        }}
    </MuiTypography>
</template>
<style></style>
