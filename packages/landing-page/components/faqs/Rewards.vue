<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import { METROM_CONTRACTS_REPO } from "../../utils/commons";
</script>
<template>
    <MetTypography lg>
        {{ $t("faq.rewards.description.text1") }}
        <a
            :href="`${METROM_CONTRACTS_REPO}/issues`"
            rel="noopener noreferrer"
            target="_blank"
            class="rewards__link"
        >
            {{ $t("faq.rewards.description.text2") }}
        </a>
        {{ $t("faq.rewards.description.text3") }}
    </MetTypography>
</template>
<style>
.rewards__link {
    @apply text-blue-600;
}
</style>
