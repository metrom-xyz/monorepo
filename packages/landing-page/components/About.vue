<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
</script>
<template>
    <section class="about__root">
        <MetTypography xl bold>{{ $t("about.title") }}</MetTypography>
        <div class="about__wrapper">
            <a href="">
                <MetTypography medium lg>
                    {{ $t("about.audits") }}
                </MetTypography>
            </a>
            <a href="">
                <MetTypography medium lg>
                    {{ $t("about.team") }}
                </MetTypography>
            </a>
            <a href="">
                <MetTypography medium lg>
                    {{ $t("about.documentation") }}
                </MetTypography>
            </a>
        </div>
    </section>
</template>
<style>
.about__root {
    @apply w-full
        flex
        flex-col
        items-center
        gap-5
        max-w-5xl
        mb-8;
}

.about__wrapper {
    @apply flex gap-5;
}
</style>
