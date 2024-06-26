<script setup lang="ts">
import { MetTypography, MetButton } from "@metrom-xyz/ui";
import HeroForeground from "../assets/HeroForeground.vue";
import ExternalIcon from "../assets/icons/MetExternalIcon.vue";
</script>
<template>
    <div class="hero__root">
        <div class="hero__wrapper">
            <div class="hero__text">
                <MetTypography h1 class="hero__text__title">
                    Design your incentives
                </MetTypography>
                <MetTypography h3 normal class="hero__text__subtitle"
                    >Attract liquidity providers by tailoring rewards to meet
                    your specific goals.
                </MetTypography>
                <MetButton secondary :icon="ExternalIcon">
                    Create campaign
                </MetButton>
            </div>
            <div class="hero__image__background">
                <HeroForeground class="hero__image__foreground" />
            </div>
        </div>
    </div>
</template>
<style>
.hero__root {
    @apply w-full flex justify-center py-10 sm:py-20;
}

.hero__wrapper {
    @apply w-full sm:w-7/12 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-0;
}

.hero__text {
    @apply w-full sm:w-5/12 flex items-center sm:items-start flex-col sm:flex gap-4 sm:mr-20 mb-10 sm:mb-0;
}

.hero__text__title {
    @apply text-center sm:text-left sm:text-[80px];
}

.hero__text__subtitle {
    @apply text-center sm:text-left mb-4;
}

.hero__image__background {
    @apply w-7/12 h-[700px] bg-hero-background rounded-[40px] relative;
}

.hero__image__foreground {
    @apply h-10 sm:h-[120%] absolute left-1/2 -translate-x-1/2 -top-10;
}
</style>
