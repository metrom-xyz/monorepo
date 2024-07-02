<script setup lang="ts">
import { MetAccordion, MetTypography } from "@metrom-xyz/ui";
import type { Component } from "vue";
import { ref } from "vue";

import CreateCampaign from "./CreateCampaign.vue";
import Lps from "./Lps.vue";
import Rewards from "./Rewards.vue";
import ExpandIcon from "../icons/Expand.vue";

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
        description: CreateCampaign,
    },
    {
        summary: "faq.lps.title",
        description: Lps,
    },
    {
        summary: "faq.rewards.title",
        description: Rewards,
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
                v-for="(faq, index) in FAQS"
                :key="index"
                :active-border="false"
                :expand-icon="ExpandIcon"
                :expanded="index === 0 ? firstAccordionOpen : undefined"
                :on-expand-toggle="
                    index === 0 ? () => onExpandToggle() : undefined
                "
            >
                <template #summary>
                    <MetTypography xl medium>
                        {{ $t(faq.summary) }}
                    </MetTypography>
                </template>
                <div class="faqs__summary">
                    <MetTypography
                        v-if="typeof faq.description === 'string'"
                        lg
                    >
                        {{ $t(faq.description) }}
                    </MetTypography>
                    <component :is="faq.description" v-else />
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
        max-w-6xl
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
