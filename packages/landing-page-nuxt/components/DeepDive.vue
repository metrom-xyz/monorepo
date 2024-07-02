<script setup lang="ts">
import { MetCard, MetTypography } from "@metrom-xyz/ui";
import MediumLogo from "./logos/Medium.vue";

// TODO: fetch articles from Medium API https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@metromxyz
const MEDIUM_ARTICLES = [
    {
        title: "Inside our Hats Finance Audit: The Key Findings",
        description:
            "Welcome to the second part of our Hats Finance summary. In this post, we delve deeper into the issues identified and share some recommendations for other teams.",
        link: "https://medium.com/@metromxyz/inside-our-hats-finance-audit-the-key-findings-dd0cf36a842a",
    },
    {
        title: "Inside Our Hats Finance Audit: The Experience",
        description:
            "At the end of April, Metrom entered a crucial phase in its journey: the auditing stage. We kicked this off with a Hats Finance Audit Competition.",
        link: "https://medium.com/@metromxyz/inside-our-hats-finance-audit-the-experience-af726ac0e536",
    },
];
</script>
<template>
    <section id="deepDive" class="deep__dive__root">
        <MetTypography xl bold>{{ $t("deepDive.title") }}</MetTypography>
        <div class="deep__dive__wrapper">
            <MetCard
                v-for="(article, index) in MEDIUM_ARTICLES"
                :key="index"
                class="deep__dive__card__wrapper"
            >
                <template #content>
                    <div class="deep__dive__card">
                        <MetTypography h3 bold>
                            {{ article.title }}
                        </MetTypography>
                        <div class="deep__dive__card__description__wrapper">
                            <MetTypography xl class="text-ellipsis">
                                {{ article.description }}
                            </MetTypography>
                            <a
                                :href="article.link"
                                rel="noopener noreferrer"
                                target="_blank"
                                class="deep__dive__card__link"
                            >
                                <MediumLogo />
                                <MetTypography lg>Medium</MetTypography>
                            </a>
                        </div>
                    </div>
                </template>
            </MetCard>
        </div>
    </section>
</template>
<style>
.deep__dive__root {
    @apply flex flex-col items-center gap-5;
}

.deep__dive__wrapper {
    @apply flex
        flex-col
        sm:flex-row
        gap-5
        justify-center;
}

.deep__dive__card__wrapper {
    @apply bg-blue;
}

.deep__dive__card {
    @apply flex
        flex-col
        gap-20
        p-9
        max-w-[380px]
        min-h-[530px];
}

.deep__dive__card__description__wrapper {
    @apply flex
        flex-col
        h-full
        flex-1
        gap-3
        justify-between;
}

.deep__dive__card__link {
    @apply flex gap-2 items-center;
}
</style>
