<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import HatsFinanceLogo from "../assets/HatsFinanceLogo.vue";
import MetInfoCard from "./info-card/MetInfoCard.vue";

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
    <div class="partners__root">
        <MetTypography xl bold>{{ $t("partners.title") }}</MetTypography>
        <div class="partners__wrapper">
            <MetInfoCard
                :key="index"
                v-for="(audit, index) in PARTNERS"
                :icon="audit.logo"
                :title="$t(audit.name)"
            />
        </div>
    </div>
</template>
<style>
.partners__root {
    @apply w-full
        flex
        flex-col
        items-center
        gap-5
        max-w-5xl;
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
