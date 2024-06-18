<script setup lang="ts">
import MuiButton from "@/ui/button/MuiButton.vue";
import { injected } from "@wagmi/core";
import { useConnect } from "vevm";

const { connect } = useConnect();
</script>
<template>
    <MuiButton @click="connect({ connector: injected() })" secondary>
        {{ $t("wallet.connect") }}
    </MuiButton>
</template>
<style></style>
