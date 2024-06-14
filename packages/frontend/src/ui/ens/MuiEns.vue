<script setup lang="ts">
import { useEnsName } from "vevm";
import type { EnsProps } from "./types";
import MuiTypography from "../typography/MuiTypography.vue";
import { shortenAddress } from "@/utils/address";

const props = defineProps<EnsProps>();

// FIXME: check why it's always undefined
const { ensName } = useEnsName({ address: props.address });
</script>
<template>
    <MuiTypography>
        {{
            ensName || props.short
                ? shortenAddress(props.address)
                : props.address
        }}
    </MuiTypography>
</template>
<style></style>
