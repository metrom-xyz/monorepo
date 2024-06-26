<script setup lang="ts">
import { MetCard, MetTypography } from "@metrom-xyz/ui";
import HatsFinanceLogo from "../assets/HatsFinanceLogo.vue";

const AUDITS = [
    {
        component: "Contracts",
        auditor: "Hats Finance",
        logo: HatsFinanceLogo,
    },
];
</script>
<template>
    <div class="audits__root">
        <MetTypography xl bold>Audits</MetTypography>
        <div class="audits__wrapper">
            <MetCard :key="index" v-for="(audit, index) in AUDITS">
                <template #content>
                    <div class="audits__card">
                        <component
                            :is="audit.logo"
                            class="audits__auditor__logo"
                        ></component>
                        <MetTypography lg>{{ audit.component }}</MetTypography>
                        <MetTypography>{{ audit.auditor }}</MetTypography>
                    </div>
                </template>
            </MetCard>
        </div>
    </div>
</template>
<style>
.audits__root {
    @apply flex flex-col items-center gap-5;
}

.audits__wrapper {
    @apply flex flex-col sm:flex-row gap-5;
}

.audits__card {
    @apply flex
        items-center
        flex-col
        min-w-48
        gap-0.5
        py-6
        px-10
        rounded-[40px];
}

.audits__auditor__logo {
    @apply h-[90px] w-[90px];
}
</style>
