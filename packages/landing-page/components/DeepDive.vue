<script setup lang="ts">
import { MetCard, MetTypography } from "@metrom-xyz/ui";
import MediumLogo from "./logos/Medium.vue";

// TODO: fetch articles from Medium API https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@metromxyz
const MEDIUM_ARTICLES = [
    {
        title: "Introducing Metrom: Design Your Incentives to AMMplify Liquidity",
        description:
            "Metrom is an all-in-one, efficient liquidity mining platform designed to make the entire liquidity process easy and accessible for both campaign creators and liquidity providers.",
        link: "https://medium.com/@metromxyz/introducing-metrom-design-your-incentives-to-ammplify-liquidity-0fe3068774e3",
    },
    {
        title: "Metrom quick start guide",
        description:
            "The idea behind Metrom is simple: make it easy to set up liquidity mining campaigns to attract the most liquidity without leaking incentives. Discover how to do it with this guide.",
        link: "https://medium.com/@metromxyz/metrom-quick-start-guide-0f85d1a05703",
    },
    {
        title: "Inside our Hats Finance Audit: The Key Findings",
        description:
            "Welcome to the second part of our Hats Finance summary. In this post, we delve deeper into the issues identified and share some recommendations for other teams.",
        link: "https://medium.com/@metromxyz/inside-our-hats-finance-audit-the-key-findings-dd0cf36a842a",
    },
];
</script>
<template>
    <section id="deepDive" class="deep_dive__root">
        <MetTypography xl bold>{{ $t("deepDive.title") }}</MetTypography>
        <div class="deep_dive__wrapper">
            <a
                v-for="(article, index) in MEDIUM_ARTICLES"
                :key="index"
                :href="article.link"
                rel="noopener noreferrer"
                target="_blank"
            >
                <MetCard class="deep_dive__card__wrapper">
                    <template #content>
                        <div class="deep_dive__card">
                            <MetTypography
                                h3
                                bold
                                class="deep_dive__card__title"
                            >
                                {{ article.title }}
                            </MetTypography>
                            <div class="deep_dive__card__description__wrapper">
                                <MetTypography xl class="text-ellipsis">
                                    {{ article.description }}
                                </MetTypography>
                            </div>
                            <div class="deep_dive__medium">
                                <MediumLogo />
                                <MetTypography lg>Medium</MetTypography>
                            </div>
                        </div>
                    </template>
                </MetCard>
            </a>
        </div>
    </section>
</template>
<style>
.deep_dive__root {
    @apply flex flex-col items-center gap-5;
}

.deep_dive__wrapper {
    @apply flex
        flex-col
        sm:flex-row
        gap-5
        justify-center;
}

.deep_dive__card__wrapper {
    @apply bg-blue
        w-[24rem]
        h-[36rem];
}

.deep_dive__card {
    @apply h-full 
        flex
        flex-col
        p-9;
}

.deep_dive__card__title {
    @apply h-20;
}

.deep_dive__card__description__wrapper {
    @apply flex
        flex-col
        h-full
        flex-1
        mt-4
        justify-between;
}

.deep_dive__medium {
    @apply flex gap-2 items-center;
}
</style>
