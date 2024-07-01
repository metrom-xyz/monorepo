<script setup lang="ts">
import { METROM_DAPP_LINK } from "../commons";
import MetromLogo from "../assets/MetromLogo.vue";
import ExternalIcon from "../assets/icons/MetExternalIcon.vue";
import { MetTypography, MetButton } from "@metrom-xyz/ui";
</script>
<template>
    <header class="navigation_bar__root">
        <nav class="navigation_bar__wrapper">
            <MetromLogo class="navigation_bar__logo" />
            <div class="navigation_bar__links">
                <a href="#features" class="navigation_bar__link">
                    <div class="navigation_bar__dot"></div>
                    <MetTypography medium lg>
                        {{ $t("navigation.features") }}
                    </MetTypography>
                </a>
                <a href="#deepDive" class="navigation_bar__link">
                    <div class="navigation_bar__dot"></div>
                    <MetTypography medium lg>
                        {{ $t("navigation.deepDive") }}
                    </MetTypography>
                </a>
                <a href="#faq" class="navigation_bar__link">
                    <div class="navigation_bar__dot"></div>
                    <MetTypography medium lg>
                        {{ $t("navigation.faq") }}
                    </MetTypography>
                </a>
            </div>
            <MetButton
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
    @apply w-full flex justify-center sm:px-24;
}

.navigation_bar__wrapper {
    @apply w-full flex items-center justify-between;
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
