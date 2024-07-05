<script setup lang="ts">
import { MetTypography, MetButton } from "@metrom-xyz/ui";

import { METROM_DAPP_LINK } from "../utils/commons";
import ExternalIcon from "./icons/External.vue";
import MetromLogo from "./logos/Metrom.vue";
import { useRuntimeConfig } from "#app";

const {
    public: { showDappLinks },
} = useRuntimeConfig();
</script>
<template>
    <header class="navigation_bar__root">
        <nav class="navigation_bar__wrapper">
            <MetromLogo class="navigation_bar__logo" />
            <div class="navigation_bar__links">
                <a href="#features" class="navigation_bar__link">
                    <div class="navigation_bar__dot" />
                    <MetTypography medium lg>
                        {{ $t("navigation.features") }}
                    </MetTypography>
                </a>
                <a href="#deepDive" class="navigation_bar__link">
                    <div class="navigation_bar__dot" />
                    <MetTypography medium lg>
                        {{ $t("navigation.deepDive") }}
                    </MetTypography>
                </a>
                <a href="#faq" class="navigation_bar__link">
                    <div class="navigation_bar__dot" />
                    <MetTypography medium lg>
                        {{ $t("navigation.faq") }}
                    </MetTypography>
                </a>
            </div>
            <MetButton
                v-if="showDappLinks"
                sm
                :icon="ExternalIcon"
                :href="METROM_DAPP_LINK"
                rel="noopener noreferrer"
                target="_blank"
            >
                {{ $t("navigation.launchDapp") }}
            </MetButton>
        </nav>
    </header>
</template>
<style>
.navigation_bar__root {
    @apply w-full flex justify-center px-6;
}

.navigation_bar__wrapper {
    @apply w-full flex items-center justify-between max-w-7xl;
}

.navigation_bar__logo {
    @apply h-8 w-36;
}

.navigation_bar__links {
    @apply hidden
        md:flex
        items-center
        justify-between
        gap-10;
}

.navigation_bar__link {
    @apply flex items-center gap-2;
}

.navigation_bar__dot {
    @apply h-2 w-2 rounded-full bg-gray-600;
}

.navigation_bar__dot__green {
    @apply bg-green;
}
</style>
