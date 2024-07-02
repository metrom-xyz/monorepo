<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
</script>
<template>
    <section id="features" class="features__root">
        <div class="feature__root">
            <img
                src="~/assets/img/placeholder-feature.webp"
                class="feature__image"
            />
            <div class="feature__text">
                <MetTypography h1 class="feature__title">
                    {{ $t("features.flow.title") }}
                </MetTypography>
                <MetTypography lg>{{
                    $t("features.flow.description")
                }}</MetTypography>
            </div>
        </div>
        <div class="feature__root">
            <img
                src="~/assets/img/placeholder-feature.webp"
                class="feature__image"
            />
            <div class="feature__text">
                <MetTypography h1 class="feature__title">
                    {{ $t("features.incentives.title") }}
                </MetTypography>
                <MetTypography lg>{{
                    $t("features.incentives.description")
                }}</MetTypography>
            </div>
        </div>
        <div class="feature__root">
            <img
                src="~/assets/img/placeholder-feature.webp"
                class="feature__image"
            />
            <div class="feature__text">
                <MetTypography h1 class="feature__title">
                    {{ $t("features.campaign.title") }}
                </MetTypography>
                <MetTypography lg>{{
                    $t("features.campaign.description")
                }}</MetTypography>
            </div>
        </div>
    </section>
</template>
<style>
.features__root {
    @apply flex
        flex-col
        gap-8
        items-center
        max-w-6xl;
}

.feature__root {
    @apply flex
        flex-col-reverse
        sm:flex-row
        sm:even:flex-row-reverse
        sm:[&>div]:even:ml-44
        gap-3
        sm:gap-24
        items-center;
}

.feature__image {
    @apply w-full
        h-full
        sm:w-[580px]
        sm:h-[340px]
        rounded-[50px];
}

.feature__text {
    @apply flex flex-col gap-3 sm:gap-4 sm:w-full;
}

.feature__title {
    @apply font-extrabold
        sm:font-bold
        leading-none
        text-[40px]
        sm:text-[60px];
}
</style>
