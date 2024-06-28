<script setup lang="ts">
import { MetAccordion, MetTypography } from "@metrom-xyz/ui";
import type { Component } from "vue";
import MetCreateCampaign from "./MetCreateCampaign.vue";
import MetLps from "./MetLps.vue";
import MetRewards from "./MetRewards.vue";
import MetExpandIcon from "../../assets/icons/MetExpandIcon.vue";
import { ref } from "vue";

const FAQS: { summary: string; description: string | Component }[] = [
    {
        summary: "faq.metrom.title",
        description: "faq.metrom.description",
    },
    {
        summary: "faq.incentives.title",
        description: "faq.incentives.description",
    },
    {
        summary: "faq.campaign.title",
        description: MetCreateCampaign,
    },
    {
        summary: "faq.lps.title",
        description: MetLps,
    },
    {
        summary: "faq.rewards.title",
        description: MetRewards,
    },
];

const firstAccordionOpen = ref(true);

function onExpandToggle() {
    firstAccordionOpen.value = !firstAccordionOpen.value;
}
</script>
<template>
    <section id="faq" class="faqs__root">
        <MetTypography xl bold>{{ $t("faq.title") }}</MetTypography>
        <div class="faqs__wrapper">
            <MetAccordion
                :key="index"
                v-for="(faq, index) in FAQS"
                :activeBorder="false"
                :expandIcon="MetExpandIcon"
                :expanded="index === 0 ? firstAccordionOpen : undefined"
                :onExpandToggle="
                    index === 0 ? () => onExpandToggle() : undefined
                "
            >
                <template #summary>
                    <MetTypography xl medium>
                        {{ $t(faq.summary) }}
                    </MetTypography>
                </template>
                <div class="faqs__summary">
                    <MetTypography v-if="typeof faq.description === 'string'">
                        {{ $t(faq.description) }}
                    </MetTypography>
                    <component v-else :is="faq.description"></component>
                </div>
            </MetAccordion>
        </div>
    </section>
</template>
<style>
.faqs__root {
    @apply flex
        flex-col
        items-center
        gap-5
        max-w-5xl
        w-full;
}

.faqs__wrapper {
    @apply w-full
        flex
        flex-col
        bg-white
        p-8
        rounded-[40px];
}

.faqs__summary {
    @apply p-2;
}
</style>
