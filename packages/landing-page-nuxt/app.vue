<script setup lang="ts">
import { useHead, useSeoMeta } from "#imports";
import NavigationBar from "./components/NavigationBar.vue";
import Hero from "./components/Hero.vue";
import Audits from "./components/Audits.vue";
import Features from "./components/features/Features.vue";
import Partners from "./components/Partners.vue";
import DeepDive from "./components/DeepDive.vue";
import Faqs from "./components/faqs/Faqs.vue";
import Socials from "./components/Socials.vue";
import About from "./components/About.vue";

useHead({
    link: [
        {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/apple-touch-icon.png",
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicon-32x32.png",
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicon-16x16.png",
        },
        {
            rel: "manifest",
            href: "/site.webmanifest",
        },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#6cff95" },
    ],
    meta: [
        {
            name: "msapplication-TileColor",
            content: "#6cff95",
        },
        { name: "theme-color", content: "#ffffff" },
    ],
});

useSeoMeta({
    title: "Metrom",
    description: "Design your incentives to AMMplify liquidity.",

    ogTitle: "Metrom",
    ogDescription: "Design your incentives to AMMplify liquidity.",
    ogSiteName: "Metrom",
    ogType: "website",

    twitterCard: "summary_large_image",
    twitterTitle: "Metrom",
    twitterDescription: "Design your incentives to AMMplify liquidity.",
});
</script>
<template>
    <div class="app__container">
        <div class="app__content__wrapper">
            <NavigationBar />
            <div class="app__content">
                <Hero />
                <Audits />
                <Features />
                <Partners />
                <DeepDive />
                <Faqs />
                <Socials />
                <About />
            </div>
        </div>
    </div>
</template>
<style>
.app__container {
    @apply min-h-screen
        flex
        justify-center
        bg-gray-300
        bg-3
        bg-dots
        px-6
        md:px-12
        lg:px-44;
}

.app__content__wrapper {
    @apply max-w-[1920px]
        w-full
        flex
        flex-col
        sm:gap-16;
}

.app__content {
    @apply flex flex-col gap-12 items-center sm:gap-24;
}
</style>
./components/features/Features.vue
