<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import { METROM_CONTRACTS_REPO } from "../../commons";
</script>
<template>
    <MetTypography>
        {{ $t("faq.rewards.description.text1") }}
        <a
            :href="`${METROM_CONTRACTS_REPO}/issues`"
            rel="noopener noreferrer"
            target="_blank"
        >
            {{ $t("faq.rewards.description.text2") }}
        </a>
        {{ $t("faq.rewards.description.text3") }}
    </MetTypography>
</template>
<style></style>
