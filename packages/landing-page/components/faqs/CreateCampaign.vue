<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";

import { METROM_DAPP_LINK } from "../../utils/commons";
</script>
<template>
    <MetTypography lg>
        {{ $t("faq.campaign.description.text1") }}
        <a
            :href="METROM_DAPP_LINK"
            rel="noopener noreferrer"
            target="_blank"
            class="create__campaign__link"
        >
            metrom.xyz.app
        </a>
        {{ $t("faq.campaign.description.text2") }}
    </MetTypography>
    <ol class="create__campaign__list">
        <li>
            <MetTypography lg>
                {{ $t("faq.campaign.description.step1") }}
            </MetTypography>
        </li>
        <li>
            <MetTypography lg>
                {{ $t("faq.campaign.description.step2") }}
            </MetTypography>
        </li>
        <li>
            <MetTypography lg>
                {{ $t("faq.campaign.description.step3") }}
            </MetTypography>
        </li>
        <li>
            <MetTypography lg>
                {{ $t("faq.campaign.description.step4") }}
            </MetTypography>
        </li>
    </ol>
</template>
<style>
.create__campaign__list {
    @apply list-decimal ml-5;
}

.create__campaign__link {
    @apply text-blue-600;
}
</style>
