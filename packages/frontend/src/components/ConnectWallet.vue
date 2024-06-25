<script setup lang="ts">
import { MetButton } from "@metrom-xyz/ui";
import { injected } from "@wagmi/core";
import { useConnect } from "vevm";

const { connect } = useConnect();
</script>
<template>
    <MetButton @click="connect({ connector: injected() })" secondary>
        {{ $t("wallet.connect") }}
    </MetButton>
</template>
<style></style>
