<script setup lang="ts">
import { MetTypography } from "@metrom-xyz/ui";
import type { FeatureProps } from "./types";

defineProps<FeatureProps>();
</script>
<template>
    <div class="feature__root">
        <img :src="$props.image" class="feature__image" />
        <div class="feature__text">
            <MetTypography h1 class="feature__title">
                {{ $t($props.title) }}
            </MetTypography>
            <MetTypography lg>{{ $t($props.description) }}</MetTypography>
        </div>
    </div>
</template>
<style>
.feature__root {
    @apply flex
        flex-col-reverse
        sm:flex-row
        sm:even:flex-row-reverse
        sm:[&>div]:even:ml-44
        gap-3
        sm:gap-10
        items-center;
}

.feature__image {
    @apply w-full
        h-full
        sm:w-[520px]
        sm:h-[340px]
        rounded-[50px];
}

.feature__text {
    @apply flex flex-col gap-3 sm:gap-4 sm:w-[406px];
}

.feature__title {
    @apply font-extrabold
        sm:font-bold
        leading-none
        text-[40px]
        sm:text-[60px];
}
</style>
