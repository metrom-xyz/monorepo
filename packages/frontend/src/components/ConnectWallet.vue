<script setup lang="ts">
import MuiButton from "@/ui/button/MuiButton.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { injected } from "@wagmi/core";
import { useConnect } from "vevm";

const { connect } = useConnect();
</script>
<template>
    <MuiButton @click="connect({ connector: injected() })">
        <MuiTypography uppercase>{{ $t("wallet.connect") }}</MuiTypography>
    </MuiButton>
</template>
<style></style>
