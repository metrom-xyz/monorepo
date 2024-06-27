<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import TelegramLogo from "../assets/TelegramLogo.vue";
import MediumLogo from "../assets/MediumLogoBlue.vue";
import XLogo from "../assets/XLogo.vue";
import MetInfoCard from "./info-card/MetInfoCard.vue";
import { METROM_MEDIUM, METROM_TELEGRAM, METROM_X_ACCOUNT } from "../commons";

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
    <div class="socials__root">
        <MetTypography xl bold>{{ $t("socials.title") }}</MetTypography>
        <div class="socials__wrapper">
            <MetInfoCard
                :key="index"
                v-for="(social, index) in SOCIALS"
                :icon="social.logo"
                :title="$t(social.name)"
                :href="social.link"
            />
        </div>
    </div>
</template>
<style>
.socials__root {
    @apply w-full
        flex
        flex-col
        items-center
        gap-5
        max-w-5xl;
}

.socials__wrapper {
    @apply flex
        overflow-x-auto
        w-full
        flex-row
        gap-5
        sm:flex-wrap
        sm:justify-center;
}
</style>
