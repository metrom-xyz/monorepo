<script setup lang="ts">
import { MetTypography, MetButton } from "@metrom-xyz/ui";
import HeroForeground from "../assets/HeroForeground.vue";
import ExternalIcon from "../assets/icons/MetExternalIcon.vue";
</script>
<template>
    <div class="hero__root">
        <div class="hero__wrapper">
            <div class="hero__image__background">
                <HeroForeground class="hero__image__foreground" />
            </div>
            <div class="hero__text">
                <MetTypography h1 class="hero__text__title">
                    Design your incentives
                </MetTypography>
                <MetTypography h3 normal class="hero__text__subtitle">
                    Attract liquidity providers by tailoring rewards to meet
                    your specific goals.
                </MetTypography>
                <MetButton secondary :icon="ExternalIcon">
                    Create campaign
                </MetButton>
            </div>
        </div>
    </div>
</template>
<style>
.hero__root {
    @apply w-full flex justify-center mb-14;
}

.hero__wrapper {
    @apply w-full
        flex
        flex-col-reverse
        gap-5
        sm:flex-row-reverse
        sm:gap-16
        items-center;
}

.hero__text {
    @apply w-full
        sm:w-5/12
        flex
        items-start
        flex-col
        sm:flex
        gap-4
        mb-16;
}

.hero__text__title {
    @apply flex text-left sm:text-[80px];
}

.hero__text__subtitle {
    @apply text-left mb-4;
}

.hero__image__background {
    @apply w-full
        max-w-[680px]
        h-[350px]
        sm:h-[700px]
        bg-hero-background
        rounded-[40px]
        relative;
}

.hero__image__foreground {
    @apply w-full
        h-[512px]
        sm:h-[850px]
        sm:left-0
        -top-16
        sm:-top-14
        absolute;
}
</style>
