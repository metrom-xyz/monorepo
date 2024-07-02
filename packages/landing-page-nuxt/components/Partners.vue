<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";

import HatsFinanceLogo from "./logos/HatsFinance.vue";

// TODO: add partners
const PARTNERS = [
    {
        name: "Hats Finance",
        logo: HatsFinanceLogo,
    },
    {
        name: "Hats Finance",
        logo: HatsFinanceLogo,
    },
    {
        name: "Hats Finance",
        logo: HatsFinanceLogo,
    },
    {
        name: "Hats Finance",
        logo: HatsFinanceLogo,
    },
    {
        name: "Hats Finance",
        logo: HatsFinanceLogo,
    },
];
</script>
<template>
    <section class="partners__root">
        <MetTypography xl bold>{{ $t("partners.title") }}</MetTypography>
        <div class="partners__wrapper">
            <InfoCard
                v-for="(audit, index) in PARTNERS"
                :key="index"
                :icon="audit.logo"
                :title="audit.name"
            />
        </div>
    </section>
</template>
<style>
.partners__root {
    @apply w-full
        flex
        flex-col
        items-center
        gap-5
        max-w-6xl;
}

.partners__wrapper {
    @apply flex
        overflow-x-auto
        w-full
        flex-row
        gap-5
        sm:flex-wrap
        sm:justify-center;
}
</style>
