<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
</script>
<template>
    <MetTypography lg>
        {{ $t("faq.lps.description.text1") }}
    </MetTypography>
    <ol class="lps__list">
        <li>
            <MetTypography lg>
                {{ $t("faq.lps.description.step1") }}
            </MetTypography>
        </li>
        <li>
            <MetTypography lg>
                {{ $t("faq.lps.description.step2") }}
            </MetTypography>
        </li>
    </ol>
</template>
<style>
.lps__list {
    @apply list-decimal ml-5;
}
</style>
