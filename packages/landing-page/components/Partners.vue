<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import { Vue3Marquee } from "vue3-marquee";

import InfoCard from "./InfoCard.vue";
import HatsFinanceLogo from "./logos/HatsFinance.vue";
import AlgebraLogo from "./logos/Algebra.vue";
import SwaprLogo from "./logos/Swapr.vue";

const PARTNERS = [
    {
        name: "Hats Finance",
        logo: HatsFinanceLogo,
    },
    {
        name: "Algebra finance",
        logo: AlgebraLogo,
    },
    {
        name: "Swapr",
        logo: SwaprLogo,
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
        <div class="partners__wrapper__mobile">
            <Vue3Marquee>
                <InfoCard
                    v-for="(audit, index) in PARTNERS"
                    :key="index"
                    :icon="audit.logo"
                    :title="$t(audit.name)"
                />
            </Vue3Marquee>
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
    @apply hidden
        sm:flex
        overflow-x-auto
        w-full
        flex-wrap
        justify-center
        gap-5;
}

.partners__wrapper__mobile {
    @apply sm:hidden flex flex-row w-full;
}

.partners__wrapper__mobile > .vue3-marquee > .marquee > .info_card__root {
    @apply mx-3;
}
</style>
