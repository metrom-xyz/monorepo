<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import HatsFinanceLogo from "./logos/HatsFinance.vue";
import ZeroXCommitLogo from "./logos/0xCommit.vue";

const AUDITS = [
    {
        component: "audits.contracts",
        auditor: "Hats Finance",
        logo: HatsFinanceLogo,
    },
    {
        component: "audits.contracts",
        auditor: "0xCommit",
        logo: ZeroXCommitLogo,
    },
    {
        component: "audits.backend",
        auditor: "Hats Finance",
        logo: HatsFinanceLogo,
    },
];
</script>
<template>
    <section class="audits__root">
        <MetTypography xl bold>{{ $t("audits.title") }}</MetTypography>
        <div class="audits__wrapper">
            <InfoCard
                v-for="(audit, index) in AUDITS"
                :key="index"
                :icon="audit.logo"
                :title="$t(audit.component)"
                :description="audit.auditor"
            />
        </div>
    </section>
</template>
<style>
.audits__root {
    @apply w-full
        flex
        flex-col
        items-center
        gap-5
        max-w-6xl;
}

.audits__wrapper {
    @apply flex
        overflow-x-auto
        w-full
        flex-row
        gap-5
        sm:flex-wrap
        sm:justify-center;
}
</style>
