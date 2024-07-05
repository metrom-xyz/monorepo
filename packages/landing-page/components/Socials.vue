<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";

import {
    METROM_TELEGRAM,
    METROM_X_ACCOUNT,
    METROM_MEDIUM,
} from "../utils/commons";
import TelegramLogo from "./logos/Telegram.vue";
import XLogo from "./logos/X.vue";
import MediumLogo from "./logos/Medium.vue";
import InfoCard from "./InfoCard.vue";

const SOCIALS = [
    {
        name: "Telegram",
        logo: TelegramLogo,
        link: METROM_TELEGRAM,
    },
    {
        name: "X",
        logo: XLogo,
        link: METROM_X_ACCOUNT,
    },
    {
        name: "Medium",
        logo: MediumLogo,
        link: METROM_MEDIUM,
    },
];
</script>
<template>
    <section class="socials__root">
        <MetTypography xl bold>{{ $t("socials.title") }}</MetTypography>
        <div class="socials__wrapper">
            <InfoCard
                v-for="(social, index) in SOCIALS"
                :key="index"
                :icon="social.logo"
                :title="social.name"
                :href="social.link"
            />
        </div>
    </section>
</template>
<style>
.socials__root {
    @apply w-full
        flex
        flex-col
        items-center
        gap-5
        max-w-6xl;
}

.socials__wrapper {
    @apply flex
        justify-center
        w-full
        flex-row
        gap-5;
}
</style>
